import React, { useState, useRef, useEffect } from 'react';
import styles from './AudioControls.module.css';

const AudioControls = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [selectedFile, setSelectedFile] = useState(null);
  const mediaRecorderRef = useRef(null);
  const timerRef = useRef(null);
  const chunksRef = useRef([]);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (mediaRecorderRef.current && isRecording) {
        mediaRecorderRef.current.stop();
      }
    };
  }, [isRecording]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60).toString().padStart(2, '0');
    const secs = (seconds % 60).toString().padStart(2, '0');
    return `${mins}:${secs}`;
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      
      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      };

      mediaRecorderRef.current.onstop = () => {
        const audioBlob = new Blob(chunksRef.current, { type: 'audio/wav' });
        chunksRef.current = [];
        // Store the recorded audio blob for later use
        console.log('Recording completed, blob size:', audioBlob.size);
      };

      mediaRecorderRef.current.start();
      setIsRecording(true);
      setRecordingTime(0);
      
      timerRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
    } catch (error) {
      console.error('Error starting recording:', error);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
      clearInterval(timerRef.current);
      setIsRecording(false);
    }
  };

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      if (file.size > 3 * 1024 * 1024) { // 3MB in bytes
        alert('File size must be less than 3MB');
        event.target.value = null;
        return;
      }

      if (!file.type.startsWith('audio/')) {
        alert('Please select an audio file');
        event.target.value = null;
        return;
      }

      setSelectedFile(file);
      // Store the file for later use
      console.log('File selected:', file.name);
    }
  };

  return (
    <div className={styles.audioControls}>
      <div className={styles.recordingSection}>
        <button 
          onClick={isRecording ? stopRecording : startRecording}
          className={`${styles.recordButton} ${isRecording ? styles.recording : ''}`}
        >
          {isRecording ? 'Stop Recording' : 'Start Recording'}
        </button>
        {isRecording && (
          <div className={styles.timer}>
            {formatTime(recordingTime)}
          </div>
        )}
      </div>
      
      <div className={styles.uploadSection}>
        <label className={styles.uploadLabel}>
          Upload Audio
          <input
            type="file"
            accept="audio/*"
            onChange={handleFileSelect}
            className={styles.fileInput}
          />
        </label>
        {selectedFile && (
          <div className={styles.fileName}>
            {selectedFile.name}
          </div>
        )}
      </div>
    </div>
  );
};

export default AudioControls;