'use strict'

let log = console.log.bind(console),
  id = val => document.getElementById(val),
  transcriptionFile = id('transcriptionFile'),
  transcription = id('transcription'),
  audioFile = id('audioFile'),
  audio = id('audio'),
  recordings = id('recordings'),
  start = id('start'),
  stop = id('stop'),
  stream,
  recorder,
  counter = 1,
  chunks,
  media = {
    tag: 'audio',
    type: 'audio/ogg',
    ext: '.ogg',
    gUM: { audio: true }
  };

requestPermission();

function requestPermission() {
  navigator.mediaDevices.getUserMedia(media.gUM).then(_stream => {
    stream = _stream;
    start.removeAttribute('disabled');
    recorder = new MediaRecorder(stream);
    recorder.ondataavailable = e => {
      chunks.push(e.data);
      if (recorder.state == 'inactive') makeLink();
    };
  }).catch(log);
}

transcriptionFile.onchange = e => {
  const files = transcriptionFile.files
  if (files.length > 0) {
    transcription.src = URL.createObjectURL(files[0]);
  }
}

audioFile.onchange = e => {
  const files = audioFile.files
  if (files.length > 0) {
    audio.src = URL.createObjectURL(files[0]);
  }
}

start.onclick = e => {
  start.disabled = true;
  stop.removeAttribute('disabled');
  chunks = [];
  recorder.start();
}

stop.onclick = e => {
  recorder.stop();
  stop.disabled = true;
  start.removeAttribute('disabled');
}

function makeLink() {
  let blob = new Blob(chunks, { type: media.type })
    , url = URL.createObjectURL(blob)
    , mt = document.createElement(media.tag)
    , hf = document.createElement('a')
    ;

  mt.className = 'col mt-1'
  mt.controls = true;
  mt.setAttribute('width', '100%');
  mt.src = url;
  recordings.appendChild(mt);

  hf.className = 'col-1'
  hf.href = url;
  hf.download = `${counter++}${media.ext}`;
  hf.innerHTML = `Baixar ${hf.download}`;
  recordings.appendChild(hf);
}
