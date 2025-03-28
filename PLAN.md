
# Blocks Social Media Application Implementation Plan

## Overview
Blocks is a decentralized social media application running on the Lens Protocol (built on Polygon Network) that combines the community-based structure of Reddit with blockchain technology. Users can earn tokens ($BLKS) for creating quality content, receive tips, and build reputation within the community.

## Core Architecture

### Hybrid Architecture
- **On-Chain (Lens Protocol + Custom Contracts):**
  - Lens Protocol: Profiles, Publications, Groups, Reactions
  - Custom Contracts: BLKSToken, EnhancedReaction, UCREngine
- **Off-Chain:**
  - Caching Layer: Redis for temporary storage
  - Reputation Engine: UCR calculation
  - UI Caching: Fast content delivery

## Core Features

### Phase 1: Foundation & Authentication ✅
- [x] Design modern, minimalist UI with Apple-inspired aesthetics
- [x] Implement wallet connection (MetaMask, Coinbase Wallet, WalletConnect)
- [x] Create loading screen with animated logo
- [x] Design landing page with split layout (branding and login)
- [x] Develop responsive layouts for desktop and mobile
- [x] Add dark theme with carefully selected accent colors
- [x] Implement glassmorphism effects and minimalist design language

### Phase 2: User Profiles & Onboarding ✅
- [x] Design profile creation flow for first-time users
- [x] Implement username registration connected to wallet addresses
- [x] Create bio, profile picture and social media fields
- [x] Mock IPFS integration for profile picture storage
- [x] Add local caching of profile data for fast loading
- [x] Update UI components to display profile information

### Phase 3: Core Social Features 🔄
- [x] Implement main three-column layout
  - [x] Left sidebar: Navigation (collapsible)
  - [x] Center: Content feed
  - [x] Right sidebar: Trending and suggestions
- [x] Create post display functionality
- [x] Create post creation functionality
- [ ] Implement like/dislike system with net vote calculation
- [ ] Develop comment system
- [ ] Build profile editing and management
- [ ] Design user credit rating (UCR) display

### Phase 4: Award System & Post Ratings 🔄
- [ ] Implement award levels based on like thresholds
  - [ ] Bronze (>5 likes), Silver (>20), Gold (>50)
  - [ ] Platinum (>150), Diamond (>500), Ace (>1000), Conqueror (>1M)
- [ ] Add visual indicators for post ratings
- [ ] Integrate Kill Zone functionality (hide posts with <-2 net votes)

### Phase 5: Community Features 🔄
- [x] Implement basic subBlocks navigation
- [ ] Create community creation interface
- [ ] Develop community discovery features
- [ ] Build community moderation tools
- [ ] Implement community-specific feeds

### Phase 6: Blockchain Integration 🔄
- [x] Implement wallet authentication
- [x] Connect to Lens Protocol (on Polygon network)
- [x] Create basic Lens Protocol integration for posts
- [ ] Implement Lens Protocol social graph integration
- [ ] Implement BLKS token functionality
- [ ] Create tipping system
- [ ] Develop NFT ownership for content
- [ ] Build award system based on likes

### Phase 7: User Credit Rating (UCR) System ⏱️
- [ ] Implement UCR calculation algorithm
- [ ] Create UCR display in profiles
- [ ] Add UCR-based restrictions and benefits
- [ ] Integrate UCR with content discovery

### Phase 8: Content Storage & Caching ⏱️
- [x] Implement mock IPFS integration for profile pictures
- [x] Create mock IPFS integration for post images
- [ ] Create real IPFS integration for all content storage
- [ ] Develop caching layer for fast content delivery
- [ ] Implement lazy loading for infinite scrolling
- [ ] Add compressed preview images for faster loading

### Phase 9: Lens Protocol Features ⏱️
- [x] Implement basic Lens Protocol integration
- [ ] Implement Lens Protocol profiles
- [ ] Integrate with Lens Protocol social graph
- [ ] Support Lens Protocol content creation
- [ ] Enable Lens Protocol content discovery
- [ ] Implement Lens Protocol follow functionality

### Phase 10: Custom Smart Contracts ⏱️
- [ ] Develop BLKSToken.sol (ERC-20 token)
- [ ] Create EnhancedReaction.sol (for dislikes)
- [ ] Build UCREngine.sol (for reputation penalties)
- [ ] Deploy and test contracts on Polygon testnet
- [ ] Integrate contracts with frontend application

## UI Components Breakdown

### Global Components
- ✅ Smooth, minimal navigation
- ✅ Glass morphism effects for cards and panels
- ✅ Modern typography with careful spacing
- ✅ Subtle animations for interactions
- ✅ Dark theme with carefully selected accent colors

### Page Specific Components
1. **Loading Screen** ✅
   - Centered animated logo on black background
   - Smooth transition to landing page
   - Only shows on initial app load, not page transitions

2. **Landing Page** ✅
   - Split design with branding on left
   - Wallet connection options on right
   - Smooth animations and transitions

3. **Profile Setup** ✅
   - Username selection with availability check
   - Bio and social media links
   - Profile picture upload with IPFS storage (mocked)
   - Form validation and error handling

4. **Main Feed** ✅
   - Three-column responsive layout
   - Post cards with interaction buttons
   - Tab system for different feed types (For You, Following, Community)
   - Post creation functionality

5. **Post Rating System** 🔄
   - Like/dislike buttons with net vote calculation
   - Award badges for posts reaching thresholds
   - Kill Zone for posts with negative ratings
   - UCR display for post authors

6. **Profile Page** 🔄
   - User stats and UCR display
   - Content history with filtering options
   - Verification status

7. **Community Pages** ⏱️
   - Community description and rules
   - Member list and stats
   - Filtered content feed

8. **Mobile Optimization** ✅
   - Bottom navigation bar
   - Streamlined single-column layout
   - Touch-optimized interactions

## Current Implementation Status
- ✅ Implemented and completed
- 🔄 In progress 
- ⏱️ Planned for future development

## Technical Architecture

### Frontend
- React and TypeScript for UI development
- TailwindCSS for styling
- ShadcnUI for component library
- React Router for navigation
- TanStack Query for data fetching

### Blockchain Integration
- Lens Protocol (built on Polygon Network) as the primary social graph protocol
- MetaMask, Coinbase Wallet, and WalletConnect for wallet connections

### Data Storage
- IPFS for decentralized content storage (currently mocked)
- Local browser caching for performance
- IndexedDB for offline capabilities
- Lens Protocol for social graph data

## Lens Protocol Integration

### Current Implementation
- Basic wallet connection to Polygon network
- Mock API services for Lens Protocol integration
- Local storage for posts and profiles during development

### Future Implementation
- Full Lens Protocol API integration 
- Authentication with Lens Protocol
- Publication creation with Lens Protocol
- Follow functionality with Lens Protocol
- Content discovery through Lens Protocol
- Groups integration for communities (subBlocks)

## Custom Smart Contracts

### BLKSToken.sol (ERC-20 Token)
- Token economy for content rewards
- Staking mechanisms for community governance
- Distribution based on content quality

### EnhancedReaction.sol
- Extension of Lens Protocol's reaction system
- Support for dislikes in addition to likes
- Net vote calculation for content quality assessment

### UCREngine.sol
- User Credit Rating calculation and management
- On-chain penalties for low-quality content
- Integration with content visibility rules

## Next Steps
1. Implement like/dislike system with net vote calculation
2. Develop award system based on like thresholds
3. Implement comment system for post engagement
4. Build profile editing and management functionality
5. Design and implement UCR display and calculations
6. Enhance IPFS integration for content storage
7. Begin development of custom smart contracts
