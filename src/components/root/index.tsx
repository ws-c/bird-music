import { Footer } from "antd/es/layout/layout"
import Player from "../Player"
import useStore from "../../store/useStore"
const footerStyle = {
  padding: '0',
  borderTop: '1px solid #e8e8e8',
  background: '#fff',
  position: 'fixed',
  bottom: '0',
  width: '100%',
  zIndex: 1000,
}
const root = () => {
  const { showPlayer } = useStore()
  return (
    <div className="root">
      {showPlayer && (
        <Footer style={footerStyle}>
          <Player></Player>
        </Footer>
      )}
    </div>
  )
}
export default root
