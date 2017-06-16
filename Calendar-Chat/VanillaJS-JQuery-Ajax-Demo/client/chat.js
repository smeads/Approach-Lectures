// Basic Get and Post requests using Vanillas JS

const messageURL = `http://slack-server.elasticbeanstalk.com/messages`;

// get request

const xhr = new XMLHttpRequest();

xhr.open('GET', messageURL);
xhr.send();
xhr.onreadystatechange = () => {
  if (xhr.readyState === 4 && xhr.status === 200){
    const messages = JSON.parse(xhr.responseText);
    console.log(messages);
  } else {
    console.log('Error', xhr.status);
  }
}

// post request

const myMessage = {
  created_by: 'smeads',
  message: 'what up approach lecture'
}

xhr.open('POST', messageURL);
xhr.setRequestHeader('Content-type', 'application/json; charset=UTF-8');
xhr.send(JSON.stringify(myMessage));
xhr.onreadystatechange = () => {
  if (xhr.readyState === 4 && xhr.status === 200) {
    console.log(JSON.parse(xhr.responseText));
  } else {
    console.log('Error', xhr.status);
  }
}
