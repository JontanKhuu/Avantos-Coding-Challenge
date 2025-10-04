# GraphRenderer.tsx Documentation

## Overview

`GraphRenderer.tsx` is responsible for visualizing graph data using React Flow. It processes raw graph data, handles node and edge rendering, provides interactive functionality for node selection, and includes comprehensive error handling for ResizeObserver issues.

## Key Responsibilities

- **Graph Visualization**: Renders nodes and edges using React Flow
- **Data Processing**: Transforms raw API data into React Flow format
- **User Interaction**: Handles node clicks and selection events
- **API Integration**: Fetches graph data from the backend
- **Error Handling**: Comprehensive ResizeObserver error suppression

## Core Features

### Graph Data Processing
The component processes raw graph data into a format suitable for React Flow visualization:

1. **Node Processing**: Converts raw nodes to React Flow Node format with labels, form fields, and component IDs
2. **Edge Processing**: Transforms edges to React Flow Edge format with unique IDs
3. **Data Preservation**: Maintains form field values and component relationships

### Interactive Features
- **Node Selection**: Click handlers for node interaction
- **Auto-fit View**: Automatically fits the graph to the viewport
- **Responsive Layout**: Adapts to different screen sizes
- **Debounced Updates**: Prevents rapid ResizeObserver triggers

### Error Handling
- **ResizeObserver Suppression**: Comprehensive error handling for ResizeObserver loop issues
- **Multiple Error Paths**: Handles both error events and unhandled promise rejections
- **Console Error Filtering**: Suppresses specific ResizeObserver error messages

## Data Structures

### Input Data Format
```typescript
interface RawGraphData {
  nodes: Array<{
    id: string;
    data: {
      name: string;
      component_id: string;
      formFields?: Record<string, any>;
    };
    position: { x: number; y: number };
  }>;
  edges: Array<{
    source: string;
    target: string;
  }>;
  forms: Array<{
    id: string;
    name: string;
    field_schema: { properties: Record<string, any> };
  }>;
}
```

### Processed Data Format
```typescript
interface ProcessedNode {
  id: string;
  data: {
    label: string;
    formFields: Record<string, any>;
    componentId: string;
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
  2. Formats data for React Flow with labels and form fields
  3. Assigns unique IDs to edges
  4. Preserves component relationships

## Component Props

### GraphRenderProps
```typescript
interface GraphRenderProps {
  graphData?: any;                    // Optional pre-loaded graph data
  onSelectNode?: (nodeId: string) => void;  // Node selection callback
  onUpdateNodeField?: (nodeId: string, fieldKey: string, value: any) => void;  // Field update callback
}
```

### Props Description
- **graphData**: If provided, uses this data instead of fetching from API
- **onSelectNode**: Callback function called when a node is clicked
- **onUpdateNodeField**: Callback function for form field updates

## State Management

### Internal State
- **nodes**: Array of React Flow Node objects
- **edges**: Array of React Flow Edge objects

### State Updates
- **Initial Load**: Fetches and processes data on mount
- **Data Changes**: Re-processes when graphData prop changes
- **Debounced Updates**: Uses 100ms debounce to prevent rapid updates

## React Flow Integration

### Node Configuration
- **ID**: Unique identifier from original data
- **Label**: Node name for display
- **Position**: X/Y coordinates from original data
- **Data**: Includes form fields and component ID for prefill functionality

### Edge Configuration
- **ID**: Generated unique identifier (`e-${source}-${target}-${index}`)
- **Source/Target**: Original node IDs
- **Styling**: Uses default React Flow edge styling

### ReactFlow Props
- **fitView**: Automatically fits graph to viewport
- **fitViewOptions**: Padding configuration for fit view
- **Zoom Limits**: Min zoom 0.1, max zoom 2
- **Interaction**: Disabled dragging, connecting, and multi-selection
- **Selection**: Enabled single node selection

## Error Handling

### ResizeObserver Error Suppression
- **Purpose**: Prevents ResizeObserver loop errors from breaking the application
- **Implementation**:
  - Listens for specific ResizeObserver error messages
  - Suppresses error propagation and prevents default behavior
  - Handles both error events and unhandled promise rejections
  - Filters console errors for ResizeObserver issues

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
- **Debounced Updates**: 100ms debounce prevents rapid ResizeObserver triggers
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
  onUpdateNodeField={handleFieldUpdate}
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

### Enhanced Architecture
- **Added Form Field Support**: Preserves and processes form field data
- **Improved Error Handling**: Comprehensive ResizeObserver error suppression
- **Enhanced Data Processing**: Better handling of component relationships
- **Debounced Updates**: Prevents performance issues with rapid updates

### Current Features
- Core graph visualization functionality
- Node and edge rendering with form field data
- Interactive node selection
- API data fetching with error handling
- Comprehensive ResizeObserver error suppression
- Debounced updates for better performance