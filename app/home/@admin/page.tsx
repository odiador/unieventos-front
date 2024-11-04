import Link from "next/link";

const Admin = () => {
    return <div>
        {"Dashboard Admin"}
        <Link className="button" href={"/dashboard/calendars"}>Calendarios</Link>
        <Link className="button" href={"dashboard/calendars/edit/6707748ef49b8b50f398cd19/Ronda%201"}>Editar Ronda 1</Link>
    </div>
}

export default Admin;
