import {useEffect, useState} from "react"
import {ReactFlow, Node, Edge} from '@xyflow/react'; 
import '@xyflow/react/dist/style.css'

// API URL used in fetchGraphData
const API_URL = "http://localhost:3000/api/v1/123/actions/blueprints/bp_456/bpv_123/graph";

/**
 * This function fetches data from the API call made using the example data
 * @returns A promise that resolves to the raw graph JSON object.
 */
export const fetchGraphData = async (): Promise<any> => {
    // Fetching data from API endpoint, as requested.
    const response = await fetch(API_URL);
    
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json()
    return data;
};


/**
 * This function processes the JSON data for nodes and edges
 * Creates mappings for useful various information that will be used for graphing
 * @param data The raw JSON data returned from fetchGraphData.
 * @returns An object containing the processed nodes and edges.
 */
const processGraphData = (data: any): { nodes: Node[], edges: Edge[] } => {
    
    // Creating node entrys for plotting
    const nodes: Node[] = data.nodes.map((node: any) => ({
        id: node.id,
        // KEY CHANGE: Retain the full 'data' object so if we needed component_id later, it's there
        data: {label: node.data.name, ...node.data}, 
        position: node.position,
    }))

    // Creating edge entrys for plotting
    const edges: Edge[] = data.edges.map((edge: any, index: number) => ({
        // Ensures the edge ID is unique
        id: `e-${edge.source}-${edge.target}-${index}`,
        source: edge.source,
        target: edge.target,
    }))
    
    return { nodes, edges };
};

// Function for creating and rendering the nodes and edges of DAG
const GraphRender = () => {
    const [nodes, addNode] = useState<Node[]>([]) // Create useState array for plotting nodes
    const [edges, addEdge] = useState<Edge[]>([]) // Create useState array for plotting edges

    useEffect(() => {
        (async () => {  
            try {
                // Fetching data using the new reusable function
                const data = await fetchGraphData()

                // Creating node and edge entries using the new reusable function
                const { nodes, edges } = processGraphData(data);

                // Adding the nodes/edges into the respective arrays 
                addNode(nodes)
                addEdge(edges)

            } catch (error) {
                console.error("Error fetching DAG: ", error); 
            }
        })()
    }, [])

    return (
        <>
            <div className="DAG" style={{ height: 300 }}>
                <ReactFlow 
                    nodes={nodes}
                    edges={edges}
                    fitView 
                />
            </div>
        </>
    )
}

export default GraphRender;