import Content from './Content'
import Header from './Header'
import Toolbar from './Toolbar'

export default function EditorPage() {
  return (
    <>
      <div className="flex flex-col h-screen">
        <Header />
        <Toolbar />
        <Content />
      </div>
    </>
  )
}

EditorPage.displayName = 'EditorPage'
