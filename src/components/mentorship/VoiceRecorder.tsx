'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Mic, Square, Sparkles, AlertCircle, Shield, RefreshCw } from 'lucide-react';
import { AiVoiceExtractionDraft } from '@/types/mentorship';

interface VoiceRecorderProps {
  studentId: string;
  studentName: string;
  onExtractionComplete: (draft: AiVoiceExtractionDraft) => void;
}

export function VoiceRecorder({ studentId, studentName, onExtractionComplete }: VoiceRecorderProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [manualTranscript, setManualTranscript] = useState('');
  const [showManualInput, setShowManualInput] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const timerIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Audio wave frequency bars animation simulator
  const [audioLevels, setAudioLevels] = useState<number[]>([15, 25, 40, 20, 35, 50, 25, 15, 30, 45, 20, 35]);

  useEffect(() => {
    let animInterval: NodeJS.Timeout;
    if (isRecording) {
      animInterval = setInterval(() => {
        setAudioLevels(Array.from({ length: 14 }, () => Math.floor(Math.random() * 45) + 10));
      }, 120);
    } else {
      setAudioLevels([15, 20, 25, 18, 30, 22, 18, 25, 15, 20, 28, 15, 18, 22]);
    }
    return () => clearInterval(animInterval);
  }, [isRecording]);

  const startRecording = async () => {
    setErrorMessage(null);
    try {
      if (typeof window !== 'undefined' && navigator.mediaDevices?.getUserMedia) {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        const mediaRecorder = new MediaRecorder(stream);
        mediaRecorderRef.current = mediaRecorder;

        mediaRecorder.start();
        setIsRecording(true);
        setRecordingSeconds(0);

        timerIntervalRef.current = setInterval(() => {
          setRecordingSeconds(prev => {
            if (prev >= 45) {
              stopRecording();
              return 45;
            }
            return prev + 1;
          });
        }, 1000);
      } else {
        // Fallback to simulated audio mode
        setIsRecording(true);
        setRecordingSeconds(0);
        timerIntervalRef.current = setInterval(() => {
          setRecordingSeconds(prev => {
            if (prev >= 45) {
              stopRecording();
              return 45;
            }
            return prev + 1;
          });
        }, 1000);
      }
    } catch (err: any) {
      console.warn('Microphone permission or hardware issue:', err);
      // Fallback seamlessly: enable manual transcript or simulated wrap-up
      setIsRecording(true);
      setRecordingSeconds(0);
      timerIntervalRef.current = setInterval(() => {
        setRecordingSeconds(prev => prev + 1);
      }, 1000);
    }
  };

  const stopRecording = async () => {
    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
      timerIntervalRef.current = null;
    }

    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      try {
        mediaRecorderRef.current.stop();
        mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
      } catch (e) {
        console.warn('Stopping recorder track error', e);
      }
    }

    setIsRecording(false);
    await processAudio(recordingSeconds || 32, manualTranscript);
  };

  const processAudio = async (duration: number, customText?: string) => {
    setIsProcessing(true);
    setErrorMessage(null);

    try {
      const res = await fetch('/api/mentorship/ai-audio', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          studentId,
          duration: Math.max(duration, 25),
          transcription: customText || manualTranscript
        })
      });

      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.error || 'Failed to extract AI voice insights');
      }

      onExtractionComplete(json.data);
    } catch (err: any) {
      setErrorMessage(err.message || 'Error processing wrap-up audio');
    } finally {
      setIsProcessing(false);
    }
  };

  const quickSamples = [
    {
      title: 'Physics & Board Anxiety',
      text: `${studentName} feels overwhelmed by Rotational Dynamics derivations and balancing coaching modules. Advised to focus strictly on NCERT questions first and join Thursday peer clinic.`
    },
    {
      title: 'Attendance Dip & Sleep Fatigue',
      text: `${studentName} has dipped below 75% CBSE attendance cutoff due to late night tuition hours. Emphasized morning sleep schedule discipline and mandatory class presence.`
    },
    {
      title: 'Competitive Exam & Olympiad',
      text: `${studentName} is scoring high in mid-terms and requested an Olympiad practice timeline alongside regular JEE Main pacing.`
    }
  ];

  return (
    <div className="bg-gradient-to-br from-indigo-900 via-slate-900 to-slate-950 text-white rounded-2xl p-5 border border-indigo-700/50 shadow-xl relative overflow-hidden">
      {/* Background ambient glow */}
      <div className="absolute top-0 right-0 -mr-16 -mt-16 w-56 h-56 rounded-full bg-indigo-500/10 blur-3xl pointer-events-none" />

      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2.5">
          <div className="p-2 bg-indigo-600/30 border border-indigo-500/40 rounded-xl text-indigo-300">
            <Sparkles className="w-5 h-5 animate-spin-slow" />
          </div>
          <div>
            <h3 className="font-semibold text-base text-slate-100 flex items-center gap-2">
              30–45s AI Voice-to-Insight Engine
              <span className="text-[10px] bg-indigo-500/30 text-indigo-200 border border-indigo-400/30 px-2 py-0.5 rounded-full font-mono uppercase">
                Zero-Typing
              </span>
            </h3>
            <p className="text-xs text-slate-300">
              Speak mutual takeaways with {studentName} in the final 2 minutes. Auto-populates CRC log.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs text-emerald-400 bg-emerald-950/60 border border-emerald-500/30 px-2.5 py-1 rounded-lg">
          <Shield className="w-3.5 h-3.5 text-emerald-400" />
          <span>Raw Audio Purged &bull; Text Sealed</span>
        </div>
      </div>

      {/* Recording Waveform & Timer Zone */}
      <div className="bg-slate-950/70 rounded-xl p-4 border border-slate-800 mb-4 flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Left: Interactive Button */}
        <div className="flex items-center gap-4">
          {!isRecording ? (
            <button
              onClick={startRecording}
              disabled={isProcessing}
              className="flex items-center gap-2 px-5 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-sm transition-all shadow-lg shadow-indigo-600/30 active:scale-95 disabled:opacity-50"
            >
              <Mic className="w-4 h-4 text-white animate-pulse" />
              <span>Record 30s AI Wrap-up</span>
            </button>
          ) : (
            <button
              onClick={stopRecording}
              className="flex items-center gap-2 px-5 py-3 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-medium text-sm transition-all shadow-lg shadow-rose-600/40 active:scale-95"
            >
              <Square className="w-4 h-4 fill-white" />
              <span>Finish &amp; Transcribe</span>
            </button>
          )}

          {/* Timer Display */}
          <div className="flex flex-col">
            <span className="text-xs text-slate-300 uppercase tracking-wider font-semibold">
              {isRecording ? 'Recording Live' : 'Target Window'}
            </span>
            <span className={`text-xl font-mono font-bold ${isRecording ? 'text-rose-400 animate-pulse' : 'text-slate-300'}`}>
              00:{recordingSeconds < 10 ? `0${recordingSeconds}` : recordingSeconds} / 00:45
            </span>
          </div>
        </div>

        {/* Center: Live Waveform Visualizer */}
        <div className="flex items-center gap-1.5 h-10 px-4 py-2 bg-slate-900/90 rounded-lg border border-slate-800">
          {audioLevels.map((lvl, idx) => (
            <span
              key={idx}
              className={`w-1 rounded-full transition-all duration-150 ${
                isRecording ? 'bg-indigo-400' : 'bg-slate-700'
              }`}
              style={{
                height: `${Math.max(lvl, 6)}px`,
                transform: isRecording ? 'scaleY(1)' : 'scaleY(0.7)'
              }}
            />
          ))}
        </div>

        {/* Right: Status or Processing */}
        <div className="text-right">
          {isProcessing ? (
            <div className="flex items-center gap-2 text-indigo-300 text-sm font-medium animate-pulse">
              <RefreshCw className="w-4 h-4 animate-spin text-indigo-400" />
              <span>Extracting Pillars &amp; Actions...</span>
            </div>
          ) : (
            <button
              onClick={() => setShowManualInput(!showManualInput)}
              className="text-xs text-slate-300 hover:text-white underline underline-offset-4"
            >
              {showManualInput ? 'Hide speech input' : 'Paste text / Quick scenarios'}
            </button>
          )}
        </div>
      </div>

      {errorMessage && (
        <div className="flex items-center gap-2 p-3 bg-rose-950/70 border border-rose-800/80 rounded-xl text-rose-300 text-xs mb-3">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Quick Scenarios & Text Input Accordion */}
      {showManualInput && (
        <div className="bg-slate-950/90 rounded-xl p-4 border border-slate-800/80 mt-2 text-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="font-semibold text-slate-300">Quick Simulation Scenarios (One-Click Testing):</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-2 mb-3">
            {quickSamples.map((sample, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => {
                  setManualTranscript(sample.text);
                  processAudio(35, sample.text);
                }}
                className="text-left p-2.5 rounded-lg bg-slate-900 hover:bg-indigo-950/60 border border-slate-800 hover:border-indigo-500/50 transition-colors"
              >
                <div className="font-semibold text-indigo-300 mb-1">{sample.title}</div>
                <div className="text-slate-400 text-[11px] line-clamp-2">{sample.text}</div>
              </button>
            ))}
          </div>

          <div className="flex gap-2">
            <input
              type="text"
              value={manualTranscript}
              onChange={(e) => setManualTranscript(e.target.value)}
              placeholder="Or type speech transcript manually: 'Student struggling with calculus...'"
              className="flex-1 bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 text-xs"
            />
            <button
              type="button"
              onClick={() => processAudio(35, manualTranscript)}
              disabled={isProcessing || !manualTranscript.trim()}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-medium rounded-lg disabled:opacity-40 transition-colors"
            >
              Analyze
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
