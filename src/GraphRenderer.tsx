import {useEffect, useState} from "react"
import {ReactFlow, Node, Edge,} from '@xyflow/react'; 
import '@xyflow/react/dist/style.css'
import "./css/Graphrenderer.css"

const API_URL = "http://localhost:3000/api/v1/123/actions/blueprints/bp_456/bpv_123/graph";

export const fetchGraphData = async (): Promise<any> => {
    const response = await fetch(API_URL);
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    return response.json();
};

const findPredecessorNodeIds = (targetNodeId: string, edges: Array<{ source: string; target: string }>): string[] => {
	const predecessors = new Set<string>()
	const queue: string[] = [targetNodeId]
	while (queue.length) {
		const current = queue.shift() as string
		for (const e of edges) {
			if (e.target === current && !predecessors.has(e.source)) {
				predecessors.add(e.source)
				queue.push(e.source)
			}
		}
	}
	predecessors.delete(targetNodeId)
	return Array.from(predecessors)
}

const processGraphData = (data: any, direction: 'predecessors' | 'none' = 'predecessors'): { nodes: Node[], edges: Edge[] } => {
	const edgesRaw: Array<{ source: string; target: string }> = data.edges || []
	const formIdToSchema: Record<string, { properties?: Record<string, any> }> = {}
	if (Array.isArray(data.forms)) {
		for (const form of data.forms) {
			formIdToSchema[form.id] = form.field_schema || {}
		}
	}
	const nodeIdToRaw: Record<string, any> = {}
	for (const n of data.nodes || []) nodeIdToRaw[n.id] = n

	const upstreamMap: Record<string, string[]> = {}
	const downstreamMap: Record<string, string[]> = {}
	for (const e of edgesRaw) {
		upstreamMap[e.target] = [...(upstreamMap[e.target] || []), e.source]
		downstreamMap[e.source] = [...(downstreamMap[e.source] || []), e.target]
	}

	const nodes: Node[] = (data.nodes || []).map((node: any) => {
		const raw = node
		const targetFormId = raw?.data?.component_id
		const targetSchemaProps: Record<string, any> = formIdToSchema[targetFormId]?.properties || {}
		const targetFieldKeys = Object.keys(targetSchemaProps)

		let candidateIds: string[] = []
		if (direction === 'predecessors') {
			candidateIds = findPredecessorNodeIds(raw.id, edgesRaw)
		}
		const prefill: Record<string, any | null> = {}

		for (const fieldKey of targetFieldKeys) {
			let value: any | null = null
			for (const pid of candidateIds) {
				const p = nodeIdToRaw[pid]
				const maybeValues = p?.data?.values || {}
				if (maybeValues && maybeValues[fieldKey] != null) {
					value = maybeValues[fieldKey]
					break
				}
			}
			prefill[fieldKey] = value
		}

		return {
			id: raw.id,
			data: { label: raw?.data?.name, prefill, upstreamIds: upstreamMap[raw.id] || [], downstreamIds: downstreamMap[raw.id] || [] },
			position: raw.position
		}
	})

	const edges: Edge[] = edgesRaw.map((edge: any, index: number) => ({
		id: `e-${edge.source}-${edge.target}-${index}`,
		source: edge.source,
		target: edge.target,
	}))
	
	return { nodes, edges };
};

interface GraphRenderProps {
    graphData?: any;
    onSelectNode?: (nodeId: string) => void;
    prefillFrom?: 'predecessors' | 'none';
}

const GraphRender = ({ graphData, onSelectNode, prefillFrom = 'predecessors' }: GraphRenderProps) => {
    const [nodes, addNode] = useState<Node[]>([])
    const [edges, addEdge] = useState<Edge[]>([])

    useEffect(() => {
        if (graphData) {
            const { nodes, edges } = processGraphData(graphData, prefillFrom)
            addNode(nodes)
            addEdge(edges)
            return
        }

        (async () => {  
            try {
                const data = await fetchGraphData()
                const { nodes, edges } = processGraphData(data, prefillFrom);
                addNode(nodes)
                addEdge(edges)
            } catch (error) {
                console.error("Error fetching DAG: ", error); 
            }
        })()
    }, [graphData, prefillFrom])

    return (
        <>
            <h1>Graph Here</h1>
            <div className="graph-container">
                <ReactFlow 
                    nodes={nodes}
                    edges={edges}
                    onNodeClick={(_, node) => onSelectNode && onSelectNode(node.id)}
                    fitView 
                />
            </div>
        </>
    )
}

export default GraphRender;