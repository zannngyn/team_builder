# Nghịch Thủy Hàn Guild War Planner

## Goal

Build a web application that helps guild leaders organize 60-player Guild War formations for Nghịch Thủy Hàn.

The application is NOT an AI auto-battler and NOT a game simulator.

Its primary purpose is to help commanders:

- Manage guild rosters
- Assign classes
- Assign lanes
- Build formations
- Drag and drop members between teams
- Share battle plans

## Context

Guild War is a 60 vs 60 game mode.

Structure:

- 2 divisions
- 5 teams per division
- 6 players per team
- Total: 10 teams

There are 7 classes:

- Thiết Y
- Toái Mộng
- Huyết Hà
- Cửu Linh
- Tố Vấn
- Thần Tuơng
- Long Ngâm

Players are usually pasted from Discord, Zalo, Messenger, or spreadsheets.

The roster normally contains only player names.

The application must make it easy to assign classes visually.

---

## Tech Stack

- Next.js (App Router)
- TypeScript
- Tailwind CSS
- shadcn/ui
- MongoDB
- Zustand or React Context

---

## Core Features

### 1. Roster Import

User can paste:

Nam
Minh
Hùng
Linh

Each line becomes a player card.

No class information is required initially.

---

### 2. Class Assignment

Each player can be assigned one class.

Classes must be color coded.

Example:

Thiết Y = Green
Toái Mộng = Yellow
Huyết Hà = Red
Cửu Linh = Pink
Tố Vấn = Purple
Thần Tương = Orange
Long Ngâm = Blue

Provide two assignment modes:

- Click to select class
- Paint mode for rapid assignment

---

### 3. Lane Assignment

Each player can be assigned:

- Top
- Mid
- Bot
- Flex

Lane should be displayed as a badge.

---

### 4. Member Tags

Support custom tactical tags:

- Commander
- Caller
- Resource Team
- Carry
- Substitute

Tags should be displayed as chips.

---

### 5. Formation Builder

Create:

Division 1

- Team 1
- Team 2
- Team 3
- Team 4
- Team 5

Division 2

- Team 6
- Team 7
- Team 8
- Team 9
- Team 10

Players can be drag-and-dropped between teams.

---

### 6. Lane View

Allow grouping teams by:

- Top
- Mid
- Bot

This is a strategic view for commanders.

---

### 7. Team Health Checks

Show warnings:

- No Thiết Y
- No healer
- Too many DPS
- Team has fewer than 6 members
- Team exceeds 6 members

Warnings should be informational only.

Never automatically move players.

---

### 8. Auto Arrange (Optional)

Generate a suggested formation.

This feature must be optional.

Guild leaders should always retain manual control.

---

### 9. Share & Export

Support:

- Export as image
- Export as text
- Shareable URL

---

## Non Goals

Do NOT build:

- Chat system
- Matchmaking
- Guild recruitment
- Real-time multiplayer editing
- Game simulation
- Damage calculator

---

## UX Principles

- Designed for commanders organizing 60 players quickly before Guild War.
- Minimize typing.
- Favor drag-and-drop interactions.
- Most actions should be achievable with mouse clicks.
- Fast enough to organize an entire guild within 5 minutes.

---

## Deliverables

1. Database schema
2. Folder structure
3. UI wireframe proposal
4. MongoDB models
5. API routes
6. Zustand store
7. Drag-and-drop architecture
8. Full implementation plan
9. Incremental milestones (MVP → V2 → V3)
