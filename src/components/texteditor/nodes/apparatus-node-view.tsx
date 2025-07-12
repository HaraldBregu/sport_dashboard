import { NodeViewWrapper } from "@tiptap/react"

// const ApparatusNodeView = () => {
//     return <NodeViewWrapper className="react-component">
//         React Component
//     </NodeViewWrapper>
// }

export default function ApparatusNodeView(props: any) {
    const increase = () => {
      props.updateAttributes({
        count: props.node.attrs.count + 1,
      })
    }
  
    return (
      <NodeViewWrapper className="react-component">
        <label ref={props.ref}>React Component</label>
  
        <div className="content">
          <button onClick={increase}>
            This button has been clicked {props.node.attrs.count} times.
          </button>
        </div>
      </NodeViewWrapper>
    )
  }

  
// export default ApparatusNodeView
