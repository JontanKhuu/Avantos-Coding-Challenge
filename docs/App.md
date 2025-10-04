# App.tsx Documentation

## Overview

`App.tsx` is the main application component that orchestrates the graph visualization system. It manages the global state, handles data fetching, and coordinates communication between the graph renderer and node information components.

## Responsibilities

- **State Management**: Manages graph data, selected node, and UI state
- **Data Fetching**: Handles API calls to fetch graph data
- **Component Coordination**: Facilitates communication between GraphRenderer and NodeInfo
- **User Interaction**: Handles node selection and information display

## Key Features

### State Management
The component maintains several pieces of state:
- `graphData`: The complete graph structure from the API
- `selectedNodeId`: Currently selected node for information display
- `isNodeInfoOpen`: Controls the visibility of the node information dialog

### Data Flow
1. **Initial Load**: Fetches graph data on component mount
2. **Node Selection**: Updates selected node and opens information dialog
3. **State Synchronization**: Keeps all components in sync with current data

## API Integration

### Endpoints Used
- `GET /api/v1/123/actions/blueprints/bp_456/bpv_123/graph` - Fetches initial graph data

### Error Handling
- Catches and logs API errors
- Provides user feedback for failed operations
- Gracefully handles network issues

## Component Structure

```typescript
const App = () => {
  // State declarations
  const [graphData, setGraphData] = useState<any | undefined>(undefined)
  const [selectedNodeId, setSelectedNodeId] = useState<string | undefined>(undefined)
  const [isNodeInfoOpen, setIsNodeInfoOpen] = useState(false)

  // Effects and handlers
  useEffect(() => { /* Data fetching */ }, [])
  const handleSelectNode = (nodeId) => { /* Selection logic */ }

  // Render
  return (
    <div className="app-container">
      <GraphRender />
      <NodeInfo />
    </div>
  )
}
```

## Event Handlers

### handleSelectNode
- **Purpose**: Handles node selection from the graph
- **Process**:
  1. Sets the selected node ID
  2. Opens the node information dialog
  3. Triggers NodeInfo to load node-specific data

## Component Integration

### GraphRenderer Integration
- **Props Passed**:
  - `graphData`: Current graph data
  - `onSelectNode`: Callback for node selection

### NodeInfo Integration
- **Props Passed**:
  - `graphData`: Current graph data
  - `selectedNodeId`: ID of selected node
  - `isOpen`: Dialog visibility state
  - `onClose`: Callback to close dialog

## Styling

The component uses CSS classes for layout:
- `app-container`: Main application wrapper

## Performance Considerations

- **Data Fetching**: Only fetches data once on mount
- **State Updates**: Uses React's built-in state management for efficient re-renders
- **Error Boundaries**: Implements error handling to prevent crashes

## Dependencies

- **React**: Core framework with hooks (useState, useEffect)
- **GraphRenderer**: Custom component for graph visualization
- **NodeInfo**: Custom component for node information display
- **CSS**: App-specific styling

## Usage Example

```typescript
// The App component is typically rendered at the root level
import App from './App'

function RootComponent() {
  return <App />
}
```

## Recent Changes

### Simplified Architecture
- Removed complex prefill functionality
- Eliminated unused state variables
- Streamlined component integration
- Focused on core graph visualization features

### Removed Features
- `autoPrefill` state and related logic
- `updateNodeValue` function and API calls
- Complex prefill mapping system
- Unused control panels