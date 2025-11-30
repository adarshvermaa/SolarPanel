import AdminRoute from '../../components/AdminRoute';

export default function AdminLayoutWrapper({
    children,
}: {
    children: React.ReactNode;
}) {
    return <AdminRoute>{children}</AdminRoute>;
}
