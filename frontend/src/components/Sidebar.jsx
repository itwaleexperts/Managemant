import { Link } from "react-router-dom";

export default function Sidebar({ links, title, color }) {
  return (
    <aside className={`w-64 ${color} text-white p-4`}>
      <h2 className="text-lg font-bold mb-4">{title}</h2>
      <nav className="flex flex-col gap-2">
        {links.map((link) => (
          <Link key={link.to} to={link.to} className="hover:bg-white/20 p-2 rounded">
            {link.label}
          </Link>
        ))}
      </nav>
    </aside>
  );
}
