import React, { useState, useEffect } from 'react';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import {
  AppBar,
  Toolbar,
  Typography,
  Container,
  Card,
  CardContent,
  Button,
  TextField,
  Box,
} from '@mui/material';
import { styled } from '@mui/material/styles'; // Corrected import
import MicIcon from '@mui/icons-material/Mic';
import Confetti from 'react-confetti';

const questions = [
  // Updated questions array
  'What is your grandparent\'s favorite childhood memory?',
  'What is a hobby your parents wish they had more time for?',
  'Which country would your grandparents love to visit?',
  'What is your parent\'s favorite book or author?',
  'What was your grandparent\'s first car?',
  'What is a talent your parent has that most people don\'t know about?',
  'What is your grandparent\'s favorite song from their youth?',
  'What is a tradition your family follows during holidays?',
  'What was the name of your parent\'s first pet?',
  'What is your grandparent\'s favorite joke or saying?',
  'What sport or activity did your parents excel at in school?',
  'What is a recipe your grandparents are famous for?',
  'What was your parent\'s favorite subject in school?',
  'What is your grandparent\'s favorite place to relax?',
  'What accomplishment are your parents most proud of?',
  'What is a funny story your grandparents often tell?',
  'What was your parent\'s first job?',
  'What is your grandparent\'s favorite movie or TV show?',
  'What musical instrument can your parents play, if any?',
  'What is your grandparent\'s favorite game to play?',
  'What is a life lesson your parents have taught you?',
  'What is your grandparent\'s favorite way to spend a weekend?',
  'What is a memorable trip your parents took together?',
  'What is your grandparent\'s favorite dessert to make or eat?',
  'What is a historical event your grandparents lived through?',
  'What nickname did your parents have growing up?',
  'What is your grandparent\'s favorite animal?',
  'What is a dream your parents have yet to accomplish?',
  'What was your grandparent\'s favorite sport to watch?',
  'What is your parent\'s favorite way to relax after a long day?',
  'What is a skill your grandparents wish they had learned?',
  'What is your parent\'s favorite type of music?',
  'What is a unique fact about your grandparents?',
  'What is your parent\'s favorite outdoor activity?',
  'What language do your grandparents speak besides their native one?',
  'What is your parent\'s favorite meal of the day?',
  'What is a funny habit your grandparents have?',
  'What is your parent\'s favorite season and why?',
  'What was your grandparent\'s favorite toy as a child?',
  'What is your parent\'s favorite inspirational quote?',
  'What is something your grandparents are afraid of?',
  'What is your parent\'s favorite board or card game?',
  'What was the first concert your grandparents attended?',
  'What is your parent\'s favorite thing about their hometown?',
  'What is a book your grandparents recommend?',
  'What is your parent\'s favorite childhood memory?',
  'What is your grandparent\'s favorite type of weather?',
  'What is your parent\'s most cherished possession?',
  'What is a cause your grandparents are passionate about?',
  'What is your parent\'s dream vacation destination?',
];

const BlinkingTypography = styled(Typography)(({ theme }) => ({
  animation: 'blinking 1s infinite',
  color: theme.palette.text.primary,
  '@keyframes blinking': {
    '0%': { opacity: 1 },
    '50%': { opacity: 0 },
    '100%': { opacity: 1 },
  },
}));

const ListeningIcon = styled(MicIcon)(({ theme }) => ({
  animation: 'pulsate 2s infinite',
  color: theme.palette.primary.main,
  fontSize: '2rem',
  '@keyframes pulsate': {
    '0%': { transform: 'scale(1)', opacity: 1 },
    '50%': { transform: 'scale(1.2)', opacity: 0.7 },
    '100%': { transform: 'scale(1)', opacity: 1 },
  },
}));

function RapidFireGame() {
  const [gameStarted, setGameStarted] = useState(false);
  const [participantName, setParticipantName] = useState('');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [transcriptHistory, setTranscriptHistory] = useState([]);
  const [timeLeft, setTimeLeft] = useState(60); // 1 minute in seconds
  const [questionsAnswered, setQuestionsAnswered] = useState(0);
  const { transcript, resetTranscript } = useSpeechRecognition();

  useEffect(() => {
    if (gameStarted && timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft(prevTime => {
          if (prevTime <= 1) {
            clearInterval(timer);
            SpeechRecognition.stopListening();
            return 0;
          }
          return prevTime - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [gameStarted, timeLeft]);

  useEffect(() => {
    if (gameStarted) {
      SpeechRecognition.startListening({ continuous: true });
    } else {
      SpeechRecognition.stopListening();
    }
  }, [gameStarted]);

  useEffect(() => {
    if (gameStarted) {
      const lowerCaseTranscript = transcript.toLowerCase();
      if (lowerCaseTranscript.includes('next')) {
        // Save the current answer excluding 'next'
        const answer = lowerCaseTranscript.replace('next', '').trim();
        setTranscriptHistory(prevHistory => [
          ...prevHistory,
          {
            question: questions[currentQuestionIndex],
            answer: answer || 'No answer provided',
          },
        ]);
        resetTranscript();
        setQuestionsAnswered(prevCount => prevCount + 1);
        if (currentQuestionIndex < questions.length - 1) {
          setCurrentQuestionIndex(prevIndex => prevIndex + 1);
        } else {
          // End of questions
          SpeechRecognition.stopListening();
          setGameStarted(false);
        }
      }
    }
  }, [transcript, gameStarted, currentQuestionIndex, resetTranscript]);

  const handleStartGame = () => {
    if (participantName.trim() === '') {
      alert('Please enter your name.');
      return;
    }
    setGameStarted(true);
    setTimeLeft(60);
    setCurrentQuestionIndex(0);
    setTranscriptHistory([]);
    setQuestionsAnswered(0);
    resetTranscript();
  };

  const handleRestartGame = () => {
    setGameStarted(false);
    setParticipantName('');
    setTimeLeft(60);
    setCurrentQuestionIndex(0);
    setTranscriptHistory([]);
    setQuestionsAnswered(0);
    resetTranscript();
  };

  if (!SpeechRecognition.browserSupportsSpeechRecognition()) {
    return <span>Your browser does not support speech recognition.</span>;
  }

  return (
    <div>
      {/* AppBar with Logo and Game Name */}
      <AppBar position="static">
        <Toolbar>
          <img src="https://gazra.org/logo.png" alt="Gazra Logo" style={{ height: '50px', marginRight: '20px' }} />
          <Typography variant="h6" component="div">
            Family Bond Blitz
          </Typography>
        </Toolbar>
      </AppBar>

      <Container maxWidth="sm" style={{ marginTop: '50px' }}>
        {!gameStarted ? (
          <Card>
            <CardContent>
              <Box display="flex" justifyContent="center" mb={2}>
                <img src="https://gazra.org/logo.png" alt="Gazra Logo" style={{ height: '100px' }} />
              </Box>
              <Typography variant="h4" align="center" gutterBottom>
                Family Bond Blitz
              </Typography>
              <Typography variant="body1" align="center" gutterBottom>
                Answer as many questions as you can about your grandparents or parents within one minute!
              </Typography>
              <Typography variant="body2" color="textSecondary" align="center" gutterBottom>
                Say <strong>"NEXT"</strong> after each answer to move to the next question.
              </Typography>
              <TextField
                label="Enter Your Name"
                variant="outlined"
                fullWidth
                value={participantName}
                onChange={e => setParticipantName(e.target.value)}
                style={{ marginBottom: '20px', marginTop: '20px' }}
              />
              <Button variant="contained" color="primary" fullWidth onClick={handleStartGame}>
                Start
              </Button>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardContent>
              <Typography variant="h6">
                Participant Name: {participantName}
              </Typography>
              <Box display="flex" justifyContent="space-between" alignItems="center" mt={2}>
                <Typography variant="h6">
                  Questions Answered: {questionsAnswered}
                </Typography>
                {timeLeft <= 10 ? (
                  <BlinkingTypography variant="h6" style={{ color: 'red' }}>
                    Time Left: {timeLeft} seconds
                  </BlinkingTypography>
                ) : (
                  <Typography variant="h6">
                    Time Left: {timeLeft} seconds
                  </Typography>
                )}
              </Box>
              {timeLeft > 0 ? (
                <>
                  <Typography variant="h5" style={{ marginTop: '20px' }}>
                    Question {currentQuestionIndex + 1}:
                  </Typography>
                  <Typography variant="h6" style={{ marginBottom: '20px' }}>
                    {questions[currentQuestionIndex]}
                  </Typography>
                  <Box display="flex" alignItems="center" mb={2}>
                    <ListeningIcon />
                    <Typography variant="body1" style={{ marginLeft: '10px' }}>
                      <strong>Your Answer:</strong> {transcript}
                    </Typography>
                  </Box>
                  <Typography variant="body2" style={{ color: 'red', marginTop: '10px' }}>
                    Say <strong>"NEXT"</strong> when you're ready for the next question.
                  </Typography>
                </>
              ) : (
                <>
                  {questionsAnswered > 10 && (
                    <Confetti
                      width={window.innerWidth}
                      height={window.innerHeight}
                    />
                  )}
                  <Typography variant="h4" align="center" style={{ marginTop: '20px' }}>
                    Well done, {participantName}!
                  </Typography>
                  <Typography variant="h6" align="center" style={{ marginTop: '10px' }}>
                    You have answered {questionsAnswered} questions, which shows that you care about your grandparents.
                  </Typography>
                  {questionsAnswered > 10 && (
                    <Typography variant="h5" align="center" style={{ marginTop: '10px', color: 'green' }}>
                      Excellent job! Keep up the great work!
                    </Typography>
                  )}
                  <Typography variant="body1" align="center" style={{ marginTop: '10px' }}>
                    Keep it up and enjoy your Navaratri. Don't forget to bring your grandparents to experience the best Garba of India!
                  </Typography>
                  <Button variant="contained" color="primary" fullWidth onClick={handleRestartGame} style={{ marginTop: '20px' }}>
                    Restart Game
                  </Button>
                </>
              )}
            </CardContent>
          </Card>
        )}
      </Container>
    </div>
  );
}

export default RapidFireGame;
