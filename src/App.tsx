import {useEffect, useState} from "react"
import GraphRender, { fetchGraphData } from "./GraphRenderer"
import PrefillUI from "./PrefillUI"
import "./css/App.css"

const updateNodeValue = async (nodeId: string, fieldKey: string, value: any): Promise<void> => {
    const response = await fetch(`http://localhost:3000/api/node-values/${nodeId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ [fieldKey]: value })
    })
    if (!response.ok) throw new Error('Failed to update node value')
}

const App = () => {
    const [graphData, setGraphData] = useState<any | undefined>(undefined)
    const [selectedNodeId, setSelectedNodeId] = useState<string | undefined>(undefined)
    const [isPrefillOpen, setIsPrefillOpen] = useState(false)
    const [autoPrefill, setAutoPrefill] = useState(true)

    useEffect(() => {
        (async () => {
            try {
                const data = await fetchGraphData()
                setGraphData(data)
            } catch (e) {
                console.error(e)
            }
        })()
    }, [])

    const handleUpdateNodeValue = async (nodeId: string, fieldKey: string, value: any) => {
        try {
            await updateNodeValue(nodeId, fieldKey, value)
            const data = await fetchGraphData()
            setGraphData(data)
        } catch (error) {
            console.error('Failed to update node value:', error)
        }
    }

    const handleSelectNode = (nodeId: string) => {
        setSelectedNodeId(nodeId)
        setIsPrefillOpen(true)
    }

    return (
        <div className="app-container">
            <div className="app-controls">
            </div>
            <GraphRender graphData={graphData} onSelectNode={handleSelectNode} prefillFrom={autoPrefill ? 'predecessors' : 'none'} />
            <PrefillUI
                graphData={graphData}
                selectedNodeId={selectedNodeId}
                isOpen={isPrefillOpen}
                onClose={() => setIsPrefillOpen(false)}
                updateNodeValue={handleUpdateNodeValue}
            />
        </div>
    )
}

export default App