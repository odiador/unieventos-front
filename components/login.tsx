
function Login({ onPassword, onCode, back, }: { onPassword: Function, onCode: Function, back: Function }) {
    const goToPassword = () => onPassword();
    const goToCode = () => onCode();
    const goBack = () => back();
    return (
        <>
            <h1 className="text-center text-2xl font-semibold">Elige una opción de inicio</h1>
            <button onClick={goToPassword} type="button" className="">Usa tu contraseña</button>
            <button onClick={goToCode} type="button" className="button-secondary">Usa un código de seguridad</button>
            <button onClick={goBack} type="button" className="button-terciary">Volver</button>
        </>);
}
export { Login };
