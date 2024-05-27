# Software Studio 2023 Spring Midterm Project

### Scoring

| **Basic components**                             | **Score** | **Check** |
| :----------------------------------------------- | :-------: | :-------: |
| Membership Mechanism                             | 15%       | Y         |
| Firebase page                                    | 5%        | Y         |
| Database read/write                              | 15%       | Y         |
| RWD                                              | 15%       | Y         |
| Chatroom                                         | 20%       | Y         |

| **Advanced tools**                               | **Score** | **Check** |
| :----------------------------------------------- | :-------: | :-------: |
| Using React                                      | 10%       | Y         |
| Third-Party Sign In                              | 1%        | Y         |
| Notification                                     | 5%        | Y         |
| CSS Animation                                    | 2%        | Y         |
| Security                                         | 2%        | Y         |

| **Other useful functions**                       | **Score** | **Check** |
| :----------------------------------------------- | :-------: | :-------: |
| Displaying profile infomation                    | 1~5%      | Y         |


---

### How to setup your project

    npm init<br>
    npm install --save-dev react react-dom <br>
    npm install --save-dev webpack webpack-cli webpackdev-server <br>
    npm install --save-dev @babel/core babel-loader
    @babel/preset-env @babel/preset-react <br>
    npm install firebase<br>
    npm install -g firebase-tools<br>
    npm run build<br>
    firebase init<br>
    copy the "compiled.js" to the public folder<br>
    firebase deploy<br>

### How to use 

-Features<br>
    User Sign Up: Users can sign up with an email and password and enter a nickname or sign in 
    using existing credentials.<br><br>
    Public and Private Rooms: ALL Users will join public chat rooms or create private chat <br>
    rooms and invite others to join.<br><br>
    Real-time Messaging: Messages are sent and received in real-time using Firebase Realtime Database.<br><br>
    Notifications: Users receive browser notifications sending a new message in the chat room.<br><br>
-Operating the Web App<br>
1.Sign Up / Log In:<br>
    If you're a new user, click on "Sign Up" to create an account using your email and password.<br>
    If you already have an account, click on "Log In" and enter your credentials.<br>
2.Join a Room:<br>
    After logging in, you'll see a public chat rooms<br>
    You can also create a new private room and invite other users to join.<br>
3.Send Messages:<br>
    In the chat area, type your message in the input box at the bottom and press "Send" to send the message.<br>
    Your messages will appear in the chat area along with messages from other users in real-time.<br>
4.Receive Notifications:<br>
    If your browser supports notifications and you've granted permission, you'll receive a notification when sending a new message in the chat room.<br>

### Function description

Bonus:<br>
-Displaying profile infomation
    Simply fetch user informations

### Firebase page link

https://midterm-ef4fb.web.app/

### Others (Optional)

Have a nice day!

<style>
table th{
    width: 100%;
}
</style>