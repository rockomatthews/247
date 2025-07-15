'use client';

import { useState, useEffect, useRef } from 'react';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  List,
  ListItem,
  ListItemText,
  Avatar,
  Divider,
} from '@mui/material';
import { Send } from '@mui/icons-material';
import io, { Socket } from 'socket.io-client';

interface Comment {
  id: string;
  username: string;
  message: string;
  timestamp: Date;
}

export default function LiveComments() {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [username, setUsername] = useState('');
  const [socket, setSocket] = useState<Socket | null>(null);
  const commentsEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Disable WebSocket if no URL is provided
    if (!process.env.NEXT_PUBLIC_SOCKET_URL) {
      console.log('No WebSocket URL configured - comments disabled');
      return;
    }
    
    const socketUrl = process.env.NEXT_PUBLIC_SOCKET_URL;
    console.log('Connecting to WebSocket:', socketUrl);
    
    const socketInstance = io(socketUrl, {
      transports: ['websocket', 'polling'],
      upgrade: true
    });
    setSocket(socketInstance);

    socketInstance.on('connect', () => {
      console.log('Connected to WebSocket server');
    });

    socketInstance.on('comment', (comment: Comment) => {
      console.log('New comment received:', comment);
      setComments(prev => [...prev, comment]);
    });

    socketInstance.on('initialComments', (initialComments: Comment[]) => {
      console.log('Initial comments loaded:', initialComments.length);
      setComments(initialComments);
    });

    socketInstance.on('disconnect', () => {
      console.log('Disconnected from WebSocket server');
    });

    socketInstance.on('connect_error', (error) => {
      console.error('WebSocket connection error:', error);
    });

    return () => {
      socketInstance.disconnect();
    };
  }, []);

  useEffect(() => {
    commentsEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [comments]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() || !username.trim() || !socket) return;

    const comment: Omit<Comment, 'id'> = {
      username: username.trim(),
      message: newComment.trim(),
      timestamp: new Date(),
    };

    socket.emit('newComment', comment);
    setNewComment('');
  };

  const generateAvatar = (username: string) => {
    const colors = ['#f44336', '#e91e63', '#9c27b0', '#673ab7', '#3f51b5', '#2196f3', '#03a9f4', '#00bcd4'];
    const index = username.charCodeAt(0) % colors.length;
    return colors[index];
  };

  return (
    <Paper sx={{ height: '600px', display: 'flex', flexDirection: 'column' }}>
      <Box sx={{ p: 2, borderBottom: '1px solid', borderColor: 'divider' }}>
        <Typography variant="h6">Live Comments</Typography>
        <Typography variant="body2" color="text.secondary">
          {comments.length} comments
        </Typography>
      </Box>

      <List sx={{ flex: 1, overflow: 'auto', p: 0 }}>
        {comments.length === 0 ? (
          <ListItem>
            <ListItemText
              primary="No comments yet"
              secondary="Be the first to comment!"
              sx={{ textAlign: 'center' }}
            />
          </ListItem>
        ) : (
          comments.map((comment, index) => (
            <Box key={comment.id || index}>
              <ListItem alignItems="flex-start">
                <Avatar
                  sx={{
                    bgcolor: generateAvatar(comment.username),
                    width: 32,
                    height: 32,
                    mr: 2,
                    fontSize: '0.875rem',
                  }}
                >
                  {comment.username.charAt(0).toUpperCase()}
                </Avatar>
                <ListItemText
                  primary={
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                        {comment.username}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {new Date(comment.timestamp).toLocaleTimeString()}
                      </Typography>
                    </Box>
                  }
                  secondary={comment.message}
                />
              </ListItem>
              {index < comments.length - 1 && <Divider />}
            </Box>
          ))
        )}
        <div ref={commentsEndRef} />
      </List>

      <Box component="form" onSubmit={handleSubmit} sx={{ p: 2 }}>
        {!username && (
          <TextField
            fullWidth
            size="small"
            placeholder="Enter your name"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            sx={{ mb: 1 }}
          />
        )}
        <Box sx={{ display: 'flex', gap: 1 }}>
          <TextField
            fullWidth
            size="small"
            placeholder="Type a comment..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            disabled={!username}
          />
          <Button
            type="submit"
            variant="contained"
            disabled={!newComment.trim() || !username.trim()}
            sx={{ minWidth: 'auto', px: 2 }}
          >
            <Send fontSize="small" />
          </Button>
        </Box>
      </Box>
    </Paper>
  );
}