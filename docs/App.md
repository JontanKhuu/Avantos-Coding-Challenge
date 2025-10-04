# App.tsx Documentation

## Overview

`App.tsx` is the main application component that orchestrates the graph visualization and prefill system. It manages global state, handles data fetching, and coordinates communication between components.

## Key Responsibilities

- **State Management**: Manages graph data, selected node, UI state, and global data
- **Data Fetching**: Handles API calls to fetch graph data on component mount
- **Component Coordination**: Facilitates communication between GraphRenderer and PrefillUI
- **Global Data Management**: Provides system-wide data for prefill mapping

## Key Features

### State Management
The component maintains several pieces of state:
- `graphData`: Complete graph structure from the API (nodes, forms, edges)
- `selectedNodeId`: Currently selected node for information display
- `isNodeInfoOpen`: Controls visibility of the prefill information dialog
- `globalData`: System-wide data available for prefill mapping

### Global Data
Provides predefined global data for prefill mapping:
- **User Information**: userId, sessionId, userRole
- **System Information**: timestamp, environment, apiVersion
- **Organization Data**: companyName, region, language, timezone

### Data Flow
1. **Initial Load**: Fetches graph data on component mount
2. **Node Selection**: Updates selected node and opens prefill dialog
3. **Field Updates**: Handles form field value updates from prefill operations
4. **State Synchronization**: Keeps all components in sync with current data

## API Integration

### Endpoints Used
- `GET /api/v1/123/actions/blueprints/bp_456/bpv_123/graph` - Fetches initial graph data

### Error Handling
- Catches and logs API errors gracefully
- Provides fallback behavior for failed operations
- Handles network issues without crashing the application

## Component Structure

```typescript
const App = () => {
  // State declarations
  const [graphData, setGraphData] = useState<any | undefined>(undefined)
  const [selectedNodeId, setSelectedNodeId] = useState<string | undefined>(undefined)
  const [isNodeInfoOpen, setIsNodeInfoOpen] = useState(false)
  const [globalData] = useState<Record<string, any>>({ /* global data */ })

  // Effects and handlers
  useEffect(() => { /* ResizeObserver error suppression */ }, [])
  useEffect(() => { /* Data fetching */ }, [])
  const handleSelectNode = (nodeId) => { /* Selection logic */ }
  const handleUpdateNodeField = (nodeId, fieldKey, value) => { /* Field update logic */ }

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
  2. Opens the prefill information dialog
  3. Triggers PrefillUI to load node-specific data

### handleUpdateNodeField
- **Purpose**: Updates form field values when prefill operations occur
- **Process**:
  1. Receives node ID, field key, and new value
  2. Updates the graph data state immutably
  3. Maintains data consistency across components

## Component Integration

### GraphRenderer Integration
- **Props Passed**:
  - `graphData`: Current graph data
  - `onSelectNode`: Callback for node selection
  - `onUpdateNodeField`: Callback for field updates

### PrefillUI Integration
- **Props Passed**:
  - `graphData`: Current graph data
  - `selectedNodeId`: ID of selected node
  - `isOpen`: Dialog visibility state
  - `onClose`: Callback to close dialog
  - `onUpdateNodeField`: Callback for field updates
  - `globalData`: System-wide data for prefill mapping

## Error Handling

### ResizeObserver Error Suppression
- **Purpose**: Prevents ResizeObserver loop errors from breaking the application
- **Implementation**: 
  - Listens for specific ResizeObserver error messages
  - Suppresses error propagation and prevents default behavior
  - Handles both error events and unhandled promise rejections

## Performance Considerations

- **Data Fetching**: Only fetches data once on mount
- **State Updates**: Uses React's built-in state management for efficient re-renders
- **Immutable Updates**: Properly handles state updates to prevent unnecessary re-renders
- **Error Boundaries**: Implements comprehensive error handling

## Dependencies

- **React**: Core framework with hooks (useState, useEffect)
- **GraphRenderer**: Custom component for graph visualization
- **PrefillUI**: Custom component for prefill information and mapping
- **CSS**: App-specific styling

## Usage Example

```typescript
// The App component is typically rendered at the root level
import App from './App'

function RootComponent() {
  return <App />
}
```

## Current Features

- Graph data fetching and management
- Node selection and information display
- Form field prefill mapping system
- Global data integration
- Comprehensive error handling
- Real-time field value updates