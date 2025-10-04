# GraphRenderer.tsx Documentation

## Overview

`GraphRenderer.tsx` is responsible for visualizing graph data using React Flow. It processes raw graph data, handles node and edge rendering, and provides interactive functionality for node selection.

## Key Responsibilities

- **Graph Visualization**: Renders nodes and edges using React Flow
- **Data Processing**: Transforms raw API data into React Flow format
- **User Interaction**: Handles node clicks and selection events
- **API Integration**: Fetches graph data from the backend

## Core Features

### Graph Data Processing
The component processes raw graph data into a format suitable for React Flow visualization:

1. **Node Processing**: Converts raw nodes to React Flow Node format
2. **Edge Processing**: Transforms edges to React Flow Edge format
3. **Simplified Data Structure**: Focuses on essential node and edge information

### Interactive Features
- **Node Selection**: Click handlers for node interaction
- **Auto-fit View**: Automatically fits the graph to the viewport
- **Responsive Layout**: Adapts to different screen sizes

## Data Structures

### Input Data Format
```typescript
interface RawGraphData {
  nodes: Array<{
    id: string;
    data: {
      name: string;
      component_id: string;
    };
    position: { x: number; y: number };
  }>;
  edges: Array<{
    source: string;
    target: string;
  }>;
}
```

### Processed Data Format
```typescript
interface ProcessedNode {
  id: string;
  data: {
    label: string;
  };
  position: { x: number; y: number };
}
```

## Key Functions

### fetchGraphData
```typescript
export const fetchGraphData = async (): Promise<any>
```
- **Purpose**: Fetches graph data from the API
- **Endpoint**: `GET /api/v1/123/actions/blueprints/bp_456/bpv_123/graph`
- **Returns**: Raw graph data object
- **Error Handling**: Throws error if request fails

### processGraphData
```typescript
const processGraphData = (data: any): { nodes: Node[], edges: Edge[] }
```
- **Purpose**: Transforms raw graph data into React Flow format
- **Parameters**:
  - `data`: Raw graph data from API
- **Returns**: Processed nodes and edges for React Flow
- **Process**:
  1. Extracts nodes and edges from raw data
  2. Formats data for React Flow
  3. Assigns unique IDs to edges

## Component Props

### GraphRenderProps
```typescript
interface GraphRenderProps {
  graphData?: any;                    // Optional pre-loaded graph data
  onSelectNode?: (nodeId: string) => void;  // Node selection callback
}
```

### Props Description
- **graphData**: If provided, uses this data instead of fetching from API
- **onSelectNode**: Callback function called when a node is clicked

## State Management

### Internal State
- **nodes**: Array of React Flow Node objects
- **edges**: Array of React Flow Edge objects

### State Updates
- **Initial Load**: Fetches and processes data on mount
- **Data Changes**: Re-processes when graphData prop changes

## React Flow Integration

### Node Configuration
- **ID**: Unique identifier from original data
- **Label**: Node name for display
- **Position**: X/Y coordinates from original data
- **Data**: Simplified to contain only essential information

### Edge Configuration
- **ID**: Generated unique identifier
- **Source/Target**: Original node IDs
- **Styling**: Uses default React Flow edge styling

## Error Handling

### API Errors
- Catches fetch errors and logs to console
- Gracefully handles network failures
- Provides fallback behavior for missing data

### Data Validation
- Handles missing or malformed graph data
- Provides default values for missing properties
- Validates edge relationships

## Performance Considerations

### Data Processing
- **Simplified Processing**: Removed complex prefill calculations
- **Efficient Algorithms**: Uses optimized data transformation
- **Memory Management**: Avoids unnecessary data duplication

### Rendering
- **React Flow Optimization**: Leverages React Flow's built-in optimizations
- **Viewport Management**: Only renders visible nodes
- **Event Handling**: Efficient click event management

## Styling

### CSS Classes
- **graph-container**: Main wrapper for the React Flow component

### React Flow Styling
- Imports default React Flow styles
- Uses built-in node and edge styling
- Supports custom node types if needed

## Usage Examples

### Basic Usage
```typescript
<GraphRender 
  onSelectNode={(nodeId) => console.log('Selected:', nodeId)}
/>
```

### With Pre-loaded Data
```typescript
<GraphRender 
  graphData={myGraphData}
  onSelectNode={handleNodeSelection}
/>
```

## Dependencies

### External Libraries
- **@xyflow/react**: Graph visualization library
- **React**: Core framework with hooks

### Internal Dependencies
- **CSS**: Graph-specific styling
- **API**: Backend data source

## Recent Changes

### Simplified Architecture
- **Removed Complex Prefill Logic**: Eliminated broken prefill calculation system
- **Streamlined Data Processing**: Simplified to focus on core visualization
- **Removed Unused Features**: Eliminated predecessor analysis and form schema processing
- **Cleaner Code**: Reduced complexity and improved maintainability

### What Was Removed
- `findPredecessorNodeIds` function
- Complex prefill value calculations
- Form schema processing
- Upstream/downstream relationship mapping
- `prefillFrom` prop and related logic

### What Remains
- Core graph visualization functionality
- Node and edge rendering
- Interactive node selection
- API data fetching
- Error handling