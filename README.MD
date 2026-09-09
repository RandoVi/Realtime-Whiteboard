# (Project Name)

## Introduction

**(Project Name)** is a portfolio project created by **Ago-Laur Luik (frontend)** and **Rando Viimne (backend)** to gain practical experience in building a collaborative whiteboard and drawing application.

The project is inspired by applications such as **Excalidraw, Microsoft Paint, and Miro**, and was built to explore how a whiteboard application works internally, including drawing, object manipulation, rendering, real-time collaboration, and client-server communication.

The project is also intended to be presented as part of our developer portfolios.

## Features

- Real-time collaborative whiteboard
- Multiple users on the same board
- Drawing with pen and laser pointer
- Shapes, arrows, text and sticky notes
- Object selection, movement and resizing
- Multi-selection
- Object rotation
- Zoom and pan
- Undo / redo
- Remote cursors
- Remote selections
- Real-time object movement previews
- Keyboard shortcuts

## Architecture

The application is divided into several layers:

- Interaction
- Editor
- Document
- Presence
- Rendering
- Network / Socket communication

## Whiteboard Flow

In simple terms, when we have **User A** and remote users **B** and **C**:

- **Interaction layer** handles what the user is doing - creating, deleting, moving, resizing objects, drawing, selecting, etc.

- **Editor layer** handles permanent changes to the board state, including commands, history, undo, and redo.

- **Document** holds the current board state for the local user. The state contains objects and users.

- **Presence layer** handles temporary real-time activity that is not saved as part of the board state — cursors, object movement previews, selections, laser pointers, text editing, and similar activity.

- **Server** stores the board state received through editor commands and keeps all connected users updated by distributing both **editor commands** and **presence commands** from one user to the other connected users.

```text
                    ┌──────────────────────┐
                    │       USER A         │
                    │   Mouse / Keyboard   │
                    └──────────┬───────────┘
                               │
                 ┌─────────────┴─────────────┐
                 │                           │
                 ▼                           ▼
        ┌──────────────────┐       ┌──────────────────┐
        │ Interaction      │       │ Presence Layer   │
        │ Layer            │       │                  │
        │                  │       │ cursor / laser / │
        │ selection /      │       │ selection /      │
        │ move / resize /  │       │ previews / text  │
        │ drawing          │       │ editing          │
        └────────┬─────────┘       └────────┬─────────┘
                 │                          │
                 ▼                          │
        ┌──────────────────┐                │
        │  Editor Layer    │                │
        │                  │                │
        │ commands /       │                │
        │ history /        │                │
        │ undo / redo      │                │
        └────────┬─────────┘                │
                 │                          │
                 ▼                          ▼
        ┌──────────────────┐       ┌──────────────────┐
        │     Document     │       │      SERVER      │
        │                  │       │                  │
        │ current board    │       │ board state +    │
        │ objects + users  │       │ updates          │
        └──────────────────┘       └────────┬─────────┘
                                            │
                         ┌──────────────────┴──────────────────┐
                         │                                     │
                         ▼                                     ▼
                ┌──────────────────┐                  ┌──────────────────┐
                │     USER B       │                  │     USER C       │
                │                  │                  │                  │
                │ Document         │                  │ Document         │
                │ Editor           │                  │ Editor           │
                │ Presence         │                  │ Presence         │
                └──────────────────┘                  └──────────────────┘