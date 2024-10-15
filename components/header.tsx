import Link from "next/link";

const Header = () => {
    return (
        <header className="flex flex-col justify-center items-stretch sm:flex-row w-full px-4 py-2 gap-2">
            <div className="grow">
                <Link href={"/"} className="px-2 text-2xl font-extrabold text-white/70 select-none">{"amaTickets"}</Link>
            </div>
            <Link href={"/auth/login"} className="button">Inicia Sesión</Link>
            <Link href={"/auth/signup"} className="button button-secondary">Regístrate</Link>
        </header>
    );
}
export default Header;