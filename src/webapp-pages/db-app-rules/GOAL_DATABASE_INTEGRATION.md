
## Database Schema

### Collection: `goals`
```javascript
{
  userId: string,           // Firebase Auth user ID
  text: string,            // Goal text content
  position: {              // Position on board
    x: number,
    y: number
  },
  stickyType: string,      // "pin" or "tape"
  isPinned: boolean,       // Always true
  width: number,           // Card width in pixels
  height: number,          // Card height in pixels
  textScale: number,       // Text size multiplier (0.8, 1.0, 1.2, 1.5)
  createdAt: string        // ISO timestamp
}
```

## Security Rules Needed

Add these Firestore security rules to protect user data:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /goals/{goalId} {
      // Users can only read their own goals
      allow read: if request.auth != null && 
                     resource.data.userId == request.auth.uid;
      
      // Users can only create goals for themselves
      allow create: if request.auth != null && 
                       request.resource.data.userId == request.auth.uid;
      
      // Users can only update their own goals
      allow update: if request.auth != null && 
                       resource.data.userId == request.auth.uid;
      
      // Users can only delete their own goals
      allow delete: if request.auth != null && 
                       resource.data.userId == request.auth.uid;
    }
  }
}