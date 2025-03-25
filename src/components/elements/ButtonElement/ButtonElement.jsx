import s from './ButtonElement.module.scss'

const ButtonElement = ({ func, children, type }) => {
    return (
        <button type={type} onClick={func} className={s.button_element}>
            {children}
        </button>
    )
}

export default ButtonElement