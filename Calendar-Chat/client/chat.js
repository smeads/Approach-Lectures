// server url endpoint
const messageURI = `http://slack-server.elasticbeanstalk.com/messages`;

// HTML elements that will be manipulated/appended to
const chatContainer = document.getElementById('chat-container');
const chatForm = document.getElementById('chat-form');
const msgInput = document.getElementById('message');

// initialize new instance of XMLHttpRequest object
const xhr = new XMLHttpRequest();

// message object for sending POST requests
messageObj = {
  created_by: "Smeads",
  message: null
}

// get request to server
getMessage = (uri) => {
  // open method for initializing the request
  xhr.open('GET', uri, true);
  // send method sends the request
  xhr.send();
  // Called whenever the readyState attribute changes
  // Callback function is triggered everytime the readyState changes
  xhr.onreadystatechange = () => {
    if (xhr.readyState === 4 && xhr.status === 200) {
      const messages = JSON.parse(xhr.responseText).reverse();

      for (let i = 400; i < messages.length; i += 1) {
        let msgContainer = document.createElement('div');
        msgContainer.classList.add('msg-container');

        msgContainer.insertAdjacentHTML('beforeend', `<span class='user'>${messages[i]['created_by']}:</span>`);
        msgContainer.insertAdjacentHTML('beforeend', `<span class='message'>${messages[i]['message']}</span>`);

        chatContainer.append(msgContainer);
      }
      chatContainer.scrollTop = chatContainer.scrollHeight;
    } else {
      console.log('Error: ' + xhr.status);
    }
  }

}

postMessage = (uri, msg) => {
  xhr.open('POST', uri, true);
  // sets the value of the HTTP request header. Must call setRequestHeader()after open(), but before send().
  xhr.setRequestHeader('Content-type', 'application/json;charset=UTF-8');
  xhr.send(msg);

  xhr.onreadystatechange = () => {
    if(xhr.readyState === 4 && xhr.status === 200) {
      const messages = JSON.parse(xhr.responseText);

      let msgContainer = document.createElement('div');
      msgContainer.classList.add('msg-container');

      msgContainer.append(`<span class="user">${messages.created_by}:</span>`);
      msgContainer.append(`<span class="message">${messages.message}</span>`);
      chatContainer.append(msgContainer);

    } else {
      console.log('Error: ' + xhr.status);
    }
    chatContainer.scrollTop = chatContainer.scrollHeight;
  }
}

window.onload = (() => {
  getMessage(messageURI);

  chatForm.addEventListener('submit', (event) => {
    event.preventDefault();
    messageObj.message = msgInput.value;

    postMessage(messageURI, JSON.stringify(messageObj));
    msgInput.value = '';
  });
});
