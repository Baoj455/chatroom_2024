import React, { useState, useEffect, useRef } from "react";
import { getDatabase, ref, push, onValue, set, update } from "firebase/database";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../config";
import firebase from "firebase/compat/app";
import 'firebase/compat/database';
import '../chatroom.css';
const { Notification } = window;

export const Chatroom = ({ onLogout }) => {
    const [message, setMessage] = useState("");
    const [user, setUser] = useState(null);
    const [messages, setMessages] = useState([]);
    const [currentRoom, setCurrentRoom] = useState("Public");
    const [roomList, setRoomList] = useState([]); 
    const [publicList, setPublicList] = useState([]);
    const [privateList, setPrivateList] = useState([]);

    //new user
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setUser(user);
            if (user) {
                const db = getDatabase();
                const userRef = ref(db, `Users/${user.uid}`);
                set(userRef, { email: user.email });
                update(userRef, { name: user.displayName });
            }
        });
        return () => unsubscribe();
    }, []);

    // new user to public room
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setUser(user);
            if (user) {
                const db = getDatabase();
                const userRef = (currentRoom == "Public") ? ref(db, `rooms/public_room/${currentRoom}/users/${user.uid}`) : ref(db, `rooms/private_room/${currentRoom}/users/${user.uid}`) ;
                set(userRef, true);
            }
        });
        console.log(currentRoom);
        return () => unsubscribe();
    }, []);
    
    useEffect(() => {
        const db = getDatabase();
        const messagesRef = (currentRoom == "Public") ? ref(db, `rooms/public_room/${currentRoom}/messages`) : ref(db, `rooms/private_room/${currentRoom}/messages`) ;

        onValue(messagesRef, (snapshot) => {
            const data = snapshot.val();
            if (data) {
                const messageList = Object.values(data);
                setMessages(messageList);
            }
        });

        

        return () => setMessages([]);
    }, [currentRoom]);

    // Room list
    useEffect(() => {
        const db = getDatabase();
        const publicRoomsRef = ref(db, 'rooms/public_room/');
        const privateRoomsRef = ref(db, 'rooms/private_room/');

        // Function to fetch public room names
        const fetchPublicRooms = () => {
            onValue(publicRoomsRef, (snapshot) => {
                const publicRoomData = snapshot.val();
                if (publicRoomData) {
                    const publicRoomNames = Object.keys(publicRoomData);
                    setPublicList(publicRoomNames);
                }
            });
        };

        // Function to fetch private room names
        const fetchPrivateRooms = () => {
            const userId = user ? user.uid : null; // Get current user's UID
        
            // Initialize privateRoomNames only if it's empty
            const privateRoomNames = [];
        
            onValue(privateRoomsRef, (snapshot) => {
                const privateRoomData = snapshot.val();
                if (privateRoomData) {
                    Object.keys(privateRoomData).forEach(roomName => {
                        // Check if the current user is a member of the room
                        const usersRef = ref(db, `rooms/private_room/${roomName}/users/${userId}`);
                        onValue(usersRef, (snapshot) => {
                            if (snapshot.exists()) {
                                // If the user is a member, add the room to the list
                                privateRoomNames.push(roomName);
                                setPrivateList(privateRoomNames);
                            }
                        });
                    });
                }
            });
        };

        // Call functions to fetch room names
        fetchPublicRooms();
        fetchPrivateRooms();
    }, [user]);

        // privat Room list
        useEffect(() => {
            const db = getDatabase();
            const privateRoomsRef = ref(db, 'rooms/private_room/');
    
            // Function to fetch private room names
            const fetchPrivateRooms = () => {
                const userId = user ? user.uid : null; // Get current user's UID
            
                // Initialize privateRoomNames only if it's empty
                onValue(privateRoomsRef, (snapshot) => {
                    const privateRoomNames = [];
                    console.log(privateRoomNames);
                    const privateRoomData = snapshot.val();
                    if (privateRoomData) {
                        Object.keys(privateRoomData).forEach(roomName => {
                            // Check if the current user is a member of the room
                            const usersRef = ref(db, `rooms/private_room/${roomName}/users/${userId}`);
                            onValue(usersRef, (snapshot) => {
                                if (snapshot.exists()) {
                                    // If the user is a member, add the room to the list
                                    privateRoomNames.push(roomName);
                                    setPrivateList(privateRoomNames);
                                    console.log(privateRoomNames);
                                }
                            });
                        });
                    }
                });
            };
    
            fetchPrivateRooms();
        }, [user]);
    
     // new submit message
    const handleSubmit = (e) => {
        e.preventDefault();
        if (message.trim() === "") return;

        const db = getDatabase();
        const messagesRef = (currentRoom === "Public") ? ref(db, `rooms/public_room/${currentRoom}/messages`) : ref(db, `rooms/private_room/${currentRoom}/messages`);

        push(messagesRef, {
            text: message,
            timestamp: new Date().getTime(),
            sender: user ? user.displayName : "Anonymous"
        });

        setMessage("");

        // Trigger notification if 'Notification' is available in window
        if (window.Notification && Notification.permission === "granted") {
            new Notification("Message Sent", {
                body: "Your message has been sent successfully!",
            });
        } 
    };
   // Add room
    const handleAddRoom = (e) => {
        e.preventDefault();
        const roomName = prompt("Enter the name of the new room:");
        if (!roomName || roomName.trim() === "") return;
        const db = getDatabase();
        setCurrentRoom(roomName);

        // Update room list for both public and private rooms
        setRoomList([...roomList, roomName]);

        // Subscribe to new room's messages
        const messagesRef = ref(db, `rooms/private_room/${roomName}/messages`);
        onValue(messagesRef, (snapshot) => {
            const data = snapshot.val();
            if (data) {
                const messageList = Object.values(data);
                setMessages(messageList);
            }
        });

        // Subscribe user to new room
        if (user) {
            const userRef = ref(db, `rooms/private_room/${roomName}/users/${user.uid}`);
            set(userRef, true);
        }
    };

    // Add member
    const handleAddMember = () => {
        // 使用 prompt 提示用戶輸入要添加的用戶名稱
        const memberName = prompt("Enter the username of the member:");
    
        // 如果用戶未輸入名稱或輸入了空字符串，則不執行後續操作
        if (!memberName || memberName.trim() === "") return;
    
        // 獲取 Firebase 資料庫的實例
        const db = getDatabase();
    
        // 建立對用戶節點的參考
        const usersRef = ref(db, 'Users');
    
        // 在用戶節點上監聽值的變化
        onValue(usersRef, (snapshot) => {
            // 獲取用戶節點的資料
            const userData = snapshot.val();
    
            // 如果用戶資料存在
            if (userData) {
                // 尋找與輸入的用戶名稱相匹配的用戶
                Object.keys(userData).forEach((userId) => {
                    const user = userData[userId];
                    if (user.name === memberName) {
                        // 找到匹配的用戶，將其加入到當前聊天室的用戶列表中
                        const userRef = ref(db, `rooms/private_room/${currentRoom}/users/${userId}`);
                        set(userRef, true);
                    }
                    else{
                        alert("Not a sign up member");
                    }
                });
            }
        });
    };
     

    //scroll down
    const messageListRef = useRef(null);
    useEffect(() => {
        if (messageListRef.current) {
            messageListRef.current.scrollTop = messageListRef.current.scrollHeight;
        }
    }, [messages]);

    // log out
    const handleLogout = () => {
        auth.signOut()
            .then(() => {
                onLogout();
                console.log("User signed out");
            })
            .catch((error) => {
                console.error("Error signing out:", error);
            });
    };

    return (
        <div className="chatroom">
            <div className="sidebar">
                {user ? (
                    <div>
                        <div className="info" id="user-email">{user.email}</div>
                        <div className="info" id="user-name">{user.displayName}</div>
                    </div>
                ) : (
                    <div>{console.log("error")}</div>
                )}
                <div className="list">Public Rooms:</div>
                <div className="room-list">
                    {publicList.map((roomName, index) => (
                        <div className="roomName" key={index} onClick={() => setCurrentRoom(roomName)}>{roomName}</div>
                    ))}
                </div>
                <div className="list">Private Rooms:</div>
                <div className="room-list">
                    {privateList.map((roomName, index) => (
                        <div className="roomName" key={index} onClick={() => setCurrentRoom(roomName)}>{roomName}</div>
                    ))}
                </div>
                <button className="sidebutton" id="logout" onClick={handleLogout}>Log out</button>
                <button className="sidebutton" id="add-room" onClick={handleAddRoom}>Add Room</button>
                <button className="sidebutton" id="add-member" onClick={handleAddMember}>Add Member</button>
            </div>
            <div className="chat-area">
                <p className="room-name">{currentRoom} chatroom</p>
                <div className="message-list" ref={messageListRef}>
                    {messages.map((msg, index) => (
                        <div key={index} className={"message" + (msg.sender === (user ? user.displayName : "Anonymous") ? " own-message" : "")}>
                            <div className="sender">{msg.sender}:</div>
                            <div className="text">{msg.text}</div>
                        </div>
                    ))}
                </div>
                <div className="input-container">
                    <form onSubmit={handleSubmit} className="input-box">
                        <input
                            className="newInput"
                            placeholder="Enter your message"
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                        />
                        <button type="submit" className="send">
                            Send
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Chatroom;
