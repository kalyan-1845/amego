package main

import (
	"bytes"
	"crypto/rand"
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"sync"
	"time"

	"github.com/gorilla/websocket"
)

var upgrader = websocket.Upgrader{
	CheckOrigin: func(r *http.Request) bool {
		return true // Allow all origins for local dev
	},
}

type Client struct {
	conn *websocket.Conn
	mu   sync.Mutex
}

func (c *Client) WriteJSON(v interface{}) error {
	c.mu.Lock()
	defer c.mu.Unlock()
	return c.conn.WriteJSON(v)
}

type StoredMessage struct {
	ID     string `json:"id"`
	Text   string `json:"text"`
	User   string `json:"user"`
	AIUsed bool   `json:"aiUsed"`
}

type GroupData struct {
	Clients  map[*Client]bool
	Messages map[string]*StoredMessage
}

var (
	groups = make(map[string]*GroupData)
	mu     sync.Mutex
)

// Generate a simple unique ID
func generateID() string {
	b := make([]byte, 8)
	rand.Read(b)
	return fmt.Sprintf("%x", b)
}

func broadcastToGroup(groupID string, msg interface{}) {
	mu.Lock()
	group, ok := groups[groupID]
	if !ok {
		mu.Unlock()
		return
	}
	var clients []*Client
	for c := range group.Clients {
		clients = append(clients, c)
	}
	mu.Unlock()

	for _, c := range clients {
		err := c.WriteJSON(msg)
		if err != nil {
			log.Printf("Write error: %v", err)
			c.conn.Close()
			mu.Lock()
			delete(group.Clients, c)
			mu.Unlock()
		}
	}
}

func triggerAI(groupID string, messageID string, text string) {
	reqBody, _ := json.Marshal(map[string]string{
		"text": text,
	})

	client := &http.Client{
		Timeout: 5 * time.Second,
	}

	resp, err := client.Post("http://127.0.0.1:8000/ai", "application/json", bytes.NewBuffer(reqBody))
	var replyText string
	if err != nil {
		log.Printf("AI request failed: %v", err)
		replyText = "AI failed, try again"
	} else {
		defer resp.Body.Close()
		var res map[string]interface{}
		if err := json.NewDecoder(resp.Body).Decode(&res); err != nil {
			replyText = "AI failed, try again"
		} else if reply, ok := res["reply"].(string); ok {
			replyText = reply
		} else {
			replyText = "AI failed, try again"
		}
	}

	responseMsg := map[string]interface{}{
		"type":      "ai_response",
		"messageId": messageID,
		"reply":     replyText,
	}

	broadcastToGroup(groupID, responseMsg)
}

func handleConnections(w http.ResponseWriter, r *http.Request) {
	groupID := r.URL.Query().Get("groupId")
	if groupID == "" {
		http.Error(w, "groupId required", http.StatusBadRequest)
		return
	}

	mu.Lock()
	group, exists := groups[groupID]
	if !exists {
		group = &GroupData{
			Clients:  make(map[*Client]bool),
			Messages: make(map[string]*StoredMessage),
		}
		groups[groupID] = group
	}

	if len(group.Clients) >= 20 {
		mu.Unlock()
		http.Error(w, "group full", http.StatusForbidden)
		return
	}

	ws, err := upgrader.Upgrade(w, r, nil)
	if err != nil {
		mu.Unlock()
		log.Printf("Upgrade error: %v", err)
		return
	}

	client := &Client{conn: ws}
	group.Clients[client] = true
	log.Printf("Client connected to group %s. Total users: %d", groupID, len(group.Clients))
	mu.Unlock()

	defer func() {
		mu.Lock()
		delete(group.Clients, client)
		log.Printf("Client disconnected from group %s. Total users: %d", groupID, len(group.Clients))
		mu.Unlock()
		ws.Close()
	}()

	for {
		var rawMsg map[string]interface{}
		err := ws.ReadJSON(&rawMsg)
		if err != nil {
			break
		}

		msgType, ok := rawMsg["type"].(string)
		if !ok {
			continue // ignore safely
		}

		switch msgType {
		case "chat":
			msgID := generateID()
			text, _ := rawMsg["text"].(string)
			user, _ := rawMsg["user"].(string)

			rawMsg["messageId"] = msgID

			mu.Lock()
			group.Messages[msgID] = &StoredMessage{
				ID:     msgID,
				Text:   text,
				User:   user,
				AIUsed: false,
			}
			mu.Unlock()

			broadcastToGroup(groupID, rawMsg)

		case "ask_ai":
			msgID, _ := rawMsg["messageId"].(string)
			if msgID == "" {
				continue
			}

			mu.Lock()
			storedMsg, ok := group.Messages[msgID]
			if !ok || storedMsg.AIUsed {
				mu.Unlock()
				continue
			}
			storedMsg.AIUsed = true
			textToAsk := storedMsg.Text
			mu.Unlock()

			go triggerAI(groupID, msgID, textToAsk)

		case "offer", "answer", "ice-candidate":
			// For signaling, broadcast to everyone in the group
			// (Clients must use "user" or similar field to ignore their own echoes if needed, 
			// though usually peer-to-peer relies on "from" and "to" fields. 
			// User specs: "Broadcast these messages to all users in same group")
			broadcastToGroup(groupID, rawMsg)
		}
	}
}

func main() {
	http.HandleFunc("/ws", handleConnections)

	port := ":8080"
	log.Printf("Go server started on port %s", port)
	err := http.ListenAndServe(port, nil)
	if err != nil {
		log.Fatal("ListenAndServe: ", err)
	}
}
