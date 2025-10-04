# PrefillUI.tsx Documentation

## Overview

`PrefillUI.tsx` is a sophisticated React component that provides a comprehensive interface for configuring form prefill mappings. It allows users to map form fields to data sources from predecessor nodes or global data, creating a visual and intuitive way to set up automatic form population.

## Key Responsibilities

- **Form Field Mapping**: Maps target form fields to available data sources
- **Data Source Discovery**: Identifies available data from predecessor nodes
- **Mapping Management**: Creates, updates, and removes field mappings
- **User Interface**: Provides intuitive modal dialogs for configuration
- **State Persistence**: Maintains mapping state throughout the session

## Core Features

### Mapping System
The component implements a sophisticated mapping system that allows:
- **Field-to-Source Mapping**: Links form fields to data sources
- **Multiple Source Types**: Supports both form fields and global data
- **Hierarchical Organization**: Groups sources by node or global data
- **Visual Feedback**: Shows mapped vs unmapped fields clearly

### Data Source Discovery
Automatically discovers available data sources:
- **Predecessor Analysis**: Finds all upstream nodes
- **Field Extraction**: Extracts available fields from predecessor forms
- **Global Data**: Includes system-wide data sources
- **Dynamic Updates**: Refreshes when graph structure changes

## Data Structures

### Core Interfaces

#### RawForm
```typescript
interface RawForm {
  id: string;
  name: string;
  field_schema: { properties: Record<string, any> };
}
```

#### RawNode
```typescript
interface RawNode {
  id: string;
  data: {
    name: string;
    component_id: string;
  };
}
```

#### ProcessedNode
```typescript
interface ProcessedNode extends RawNode {
  form: RawForm | undefined;
}
```

#### MappingRule
```typescript
interface MappingRule {
  sourceType: 'FORM_FIELD' | 'GLOBAL_DATA';
  sourceValue: string;
  sourceLabel: string;
}
```

#### SourceField
```typescript
interface SourceField {
  groupName: string;
  fieldKey: string;
  sourceValue: string;
  sourceLabel: string;
  sourceType: 'FORM_FIELD' | 'GLOBAL_DATA';
}
```

### State Management

#### PrefillMappings
```typescript
type PrefillMappings = Record<string, Record<string, MappingRule>>;
```
- **Structure**: `{ nodeId: { fieldKey: MappingRule } }`
- **Purpose**: Stores all field mappings for all nodes
- **Persistence**: Maintains state throughout session

## Component Props

### PrefillUIProps
```typescript
interface PrefillUIProps {
  graphData: GraphData | undefined;           // Complete graph data
  selectedNodeId: string | undefined;       // Currently selected node
  isOpen: boolean;                           // Dialog visibility
  onClose: () => void;                       // Close dialog callback
  updateNodeValue: (nodeId: string, fieldKey: string, value: any) => void;
}
```

## Key Functions

### processGraphData
```typescript
const processGraphData = (data: GraphData): ProcessedNode[]
```
- **Purpose**: Processes raw graph data and links nodes to their forms
- **Process**:
  1. Creates a map of form IDs to form objects
  2. Links each node to its corresponding form
  3. Returns processed nodes with form references
- **Returns**: Array of ProcessedNode objects

### findPredecessorNodeIds
```typescript
const findPredecessorNodeIds = (targetNodeId: string, data: GraphData): string[]
```
- **Purpose**: Finds all predecessor nodes for a given target node
- **Algorithm**: Uses breadth-first search to traverse the graph
- **Process**:
  1. Starts with the target node
  2. Finds all parent nodes (edges where target = current)
  3. Recursively finds parents of parents
  4. Returns unique list of all predecessors
- **Returns**: Array of predecessor node IDs

### Available Sources Calculation
The component calculates available data sources using a complex useMemo hook:

```typescript
const availableSources: SourceField[] = useMemo(() => {
  // 1. Find all predecessor nodes
  // 2. Extract form fields from each predecessor
  // 3. Add global data sources
  // 4. Format as SourceField objects
}, [graphData, selectedNodeId, processedNodes]);
```

## User Interface Components

### Main Modal
- **Header**: Shows selected node name and linked form
- **Field List**: Displays all form fields with mapping status
- **Summary**: Shows count of available sources
- **Close Button**: Allows user to close the dialog

### Field Mapping Interface
- **Field Boxes**: Visual representation of each form field
- **Mapping Status**: Clear indication of mapped vs unmapped fields
- **Click to Map**: Unmapped fields are clickable to start mapping
- **Remove Mapping**: Mapped fields show remove button

### Source Selection Modal
- **Sidebar**: Hierarchical list of available data sources
- **Expandable Groups**: Groups sources by node or global data
- **Detail View**: Shows detailed information about selected source
- **Action Buttons**: Cancel and Select buttons

## State Management

### Internal State
- **prefillMappings**: Stores all field mappings
- **fieldToMap**: Currently selected field for mapping
- **expandedGroups**: Controls which source groups are expanded
- **selectedSource**: Currently selected data source

### State Updates
- **Mapping Creation**: Adds new field mappings
- **Mapping Removal**: Removes existing mappings
- **UI State**: Manages modal visibility and selections

## Event Handlers

### handleMapField
```typescript
const handleMapField = (fieldId: string) => void
```
- **Purpose**: Initiates the mapping process for a field
- **Process**:
  1. Clears any previously selected source
  2. Sets the field to be mapped
  3. Opens the source selection modal

### handleSaveMapping
```typescript
const handleSaveMapping = (targetFieldId: string, rule: MappingRule) => void
```
- **Purpose**: Saves a new field mapping
- **Process**:
  1. Updates the prefillMappings state
  2. Closes the source selection modal
  3. Refreshes the field display

### handleClearMapping
```typescript
const handleClearMapping = (targetFieldId: string) => void
```
- **Purpose**: Removes an existing field mapping
- **Process**:
  1. Removes the mapping from state
  2. Updates the field display
  3. Maintains other mappings

## Rendering Functions

### renderMappingTable
```typescript
const renderMappingTable = () => JSX.Element
```
- **Purpose**: Renders the main field mapping interface
- **Features**:
  - Lists all form fields
  - Shows mapping status (mapped/unmapped)
  - Provides click handlers for mapping
  - Displays remove buttons for mapped fields

### Source Selection Interface
- **Grouped Display**: Organizes sources by node or global data
- **Expandable Sections**: Allows users to expand/collapse groups
- **Detail Panel**: Shows detailed information about selected source
- **Selection State**: Highlights currently selected source

## Data Flow

### Source Discovery Process
1. **Node Selection**: User selects a node in the graph
2. **Predecessor Analysis**: Component finds all predecessor nodes
3. **Form Extraction**: Extracts form schemas from predecessor nodes
4. **Field Enumeration**: Lists all available fields from each form
5. **Global Data**: Adds system-wide data sources
6. **Source Formatting**: Formats sources for display

### Mapping Process
1. **Field Selection**: User clicks on an unmapped field
2. **Source Display**: Component shows available sources
3. **Source Selection**: User selects a data source
4. **Mapping Creation**: Component creates the mapping
5. **State Update**: Updates internal state and UI

## Styling and CSS

### CSS Classes
- **main-modal-overlay**: Main dialog backdrop
- **main-modal-container**: Main dialog container
- **field-box**: Individual field display boxes
- **mapped/unmapped**: Field mapping status styles
- **modal-overlay**: Source selection modal backdrop
- **sidebar**: Source list sidebar
- **group-container**: Source group containers

### Visual Design
- **Status Indicators**: Clear visual distinction between mapped and unmapped fields
- **Interactive Elements**: Hover states and click feedback
- **Modal Layering**: Proper z-index management for nested modals
- **Responsive Layout**: Adapts to different screen sizes

## Performance Considerations

### Memoization
- **processedNodes**: Memoized to avoid reprocessing on every render
- **availableSources**: Memoized to avoid recalculating on every render
- **Dependency Arrays**: Properly configured to trigger updates only when necessary

### State Management
- **Efficient Updates**: Uses functional state updates to avoid stale closures
- **Minimal Re-renders**: Optimizes component re-rendering
- **Memory Management**: Properly cleans up state when components unmount

## Error Handling

### Data Validation
- **Null Checks**: Handles missing graph data gracefully
- **Form Validation**: Validates form schema structure
- **Edge Cases**: Handles nodes without associated forms

### User Experience
- **Loading States**: Shows appropriate feedback during operations
- **Error Messages**: Displays helpful error messages
- **Fallback UI**: Provides fallback content when data is missing

## Integration Points

### GraphRenderer Integration
- **Node Selection**: Receives selected node from GraphRenderer
- **Data Sharing**: Uses shared graph data structure
- **Event Coordination**: Coordinates with graph selection events

### App Component Integration
- **State Management**: Receives state from parent App component
- **Callback Functions**: Provides callbacks for state updates
- **Data Flow**: Participates in the overall application data flow

## Usage Examples

### Basic Usage
```typescript
<PrefillUI
  graphData={graphData}
  selectedNodeId={selectedNodeId}
  isOpen={isPrefillOpen}
  onClose={() => setIsPrefillOpen(false)}
  updateNodeValue={handleUpdateNodeValue}
/>
```

### With Custom Handlers
```typescript
<PrefillUI
  graphData={graphData}
  selectedNodeId={selectedNodeId}
  isOpen={isPrefillOpen}
  onClose={handleClosePrefill}
  updateNodeValue={customUpdateHandler}
/>
```

## Future Enhancements

Potential improvements could include:
- **Bulk Mapping**: Map multiple fields at once
- **Mapping Templates**: Save and reuse mapping configurations
- **Validation Rules**: Add validation for mapping compatibility
- **Undo/Redo**: Support for undoing mapping changes
- **Export/Import**: Export mapping configurations
- **Search Functionality**: Search through available sources
- **Drag and Drop**: Drag-and-drop interface for mapping
- **Real-time Preview**: Preview mapped values before saving
