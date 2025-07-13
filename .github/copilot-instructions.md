# TopCover Gaming Application - Copilot Instructions

<!-- Use this file to provide workspace-specific custom instructions to Copilot. For more details, visit https://code.visualstudio.com/docs/copilot/copilot-customization#_use-a-githubcopilotinstructionsmd-file -->

## Project Overview

This is a React TypeScript gaming application called TopCover - a social deduction game where:

- Players are assigned different roles: Civilians, Undercovers, and Mr. White
- Civilians get the same word, Undercovers get a similar word, Mr. White gets no word
- Players eliminate each other through voting rounds
- Victory conditions vary based on who gets eliminated

## Code Style Guidelines

- Use TypeScript for type safety
- Follow React functional components with hooks
- Use modern CSS with Flexbox/Grid for layouts
- Implement responsive design
- Use clear, descriptive variable and function names
- Add proper TypeScript interfaces for game state

## Game Logic

- Maintain game state with React hooks
- Handle player setup, word distribution, and elimination rounds
- Implement win condition checking
- Ensure secure word distribution (players can't see others' words)
