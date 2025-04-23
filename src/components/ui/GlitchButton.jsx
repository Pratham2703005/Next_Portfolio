/* eslint-disable react/prop-types */
import './GlitchButton.css';
const GlitchButton = ({children, className='', onClick=null}) => {
  return (
    <button className={`!px-4 sm:!px-12 ${className}`} onClick={onClick} id="glitch"  >
    {children}
    </button>
  )
}

export default GlitchButton
