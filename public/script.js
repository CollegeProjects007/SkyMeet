const socket = io('/')
const videoGrid = document.getElementById('video-grid')
const myPeer = new Peer()
const myVideo = document.createElement('video')
myVideo.classList.add("rounded")
myVideo.muted = true
const peers = {}

navigator.mediaDevices.getUserMedia({
  video: true,
  audio: true
}).then(stream => {

  myStream=stream;
  addVideoStream(myVideo, stream)

  myPeer.on('call', call => {
    call.answer(stream)
    const video = document.createElement('video')
    video.classList.add("rounded")
    call.on('stream', userVideoStream => {
      addVideoStream(video, userVideoStream)
    })
  })

  socket.on('user-connected', userId => {
    connectToNewUser(userId, stream)
  })
})

socket.on('user-disconnected', userId => {
  if (peers[userId]) peers[userId].close()
})

myPeer.on('open', id => {
  socket.emit('join-room', ROOM_ID, id)
})

function connectToNewUser(userId, stream) {
  const call = myPeer.call(userId, stream)
  const video = document.createElement('video')
  video.classList.add("rounded")

  call.on('stream', userVideoStream => {
    addVideoStream(video, userVideoStream)
  })
  call.on('close', () => {
    video.remove()
  })

  peers[userId] = call
}

function addVideoStream(video, stream) {
  video.srcObject = stream
  video.addEventListener('loadedmetadata', () => {
    video.play()
  })
  videoGrid.append(video)
}

function muteMic() {
  myStream.getAudioTracks().forEach(track => {
    
    track.enabled = !track.enabled;
    
    if(track.enabled){
      document.getElementById("mic-btn").classList.remove("fa-microphone-slash");
      document.getElementById("mic-btn").classList.add("fa-microphone");
    }
    else{
      document.getElementById("mic-btn").classList.remove("fa-microphone");
      document.getElementById("mic-btn").classList.add("fa-microphone-slash");
    }
  });
}

function muteCam() {
  myStream.getVideoTracks().forEach(track => {
    track.enabled = !track.enabled;
    if(track.enabled){
      document.getElementById("video-btn").classList.remove("fa-video-slash");
      document.getElementById("video-btn").classList.add("fa-video");
    }
    else{
      document.getElementById("video-btn").classList.remove("fa-video");
      document.getElementById("video-btn").classList.add("fa-video-slash");
    }
  
  });
 
}

