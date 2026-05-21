import { useLocation, Link, useParams } from "react-router-dom";
import { Breadcrumb, Container } from "react-bootstrap";
import { posts } from "../data/posts"; // Import data để tìm tên bài viết theo ID

function DynamicBreadcrumb() {
  const location = useLocation();
  const params = useParams(); // Lấy các tham số động như :id từ URL

  // Bẻ nhỏ URL, ví dụ: "/posts/1" -> ["", "posts", "1"] -> lọc bỏ chuỗi rỗng -> ["posts", "1"]
  const pathnames = location.pathname.split("/").filter((x) => x);

  // Bảng từ điển ánh xạ các path tĩnh sang Tiếng Việt chuẩn UX
  const breadcrumbNameMap = {
    posts: "Danh sách bài viết",
    about: "Giới thiệu",
    profile: "Trang cá nhân",
  };

  // Hàm helper lấy tên hiển thị của từng chặng URL
  const getBreadcrumbName = (subpath) => {
    // Nếu chặng này trùng với ID bài viết đang xem, tìm tên bài viết tương ứng
    if (params.id && subpath === params.id) {
      const currentPost = posts.find((p) => p.id.toString() === params.id);
      return currentPost ? currentPost.title : "Chi tiết bài viết";
    }
    // Nếu không, tra cứu trong bảng từ điển, nếu không có thì viết hoa chữ cái đầu
    return breadcrumbNameMap[subpath] || subpath.charAt(0).toUpperCase() + subpath.slice(1);
  };

  // Nếu đang ở Trang chủ (pathnames rỗng) thì ẩn hoàn toàn Breadcrumb cho gọn giao diện
  if (pathnames.length === 0) return null;

  return (
    <Container className="mt-3">
      <Breadcrumb>
        {/* Chặng mặc định luôn là Trang chủ */}
        <Breadcrumb.Item linkAs={Link} linkProps={{ to: "/" }}>
          🏠 Trang chủ
        </Breadcrumb.Item>

        {pathnames.map((value, index) => {
          // Xây dựng đường dẫn tích lũy cho từng chặng
          // Vòng 1: "/posts" | Vòng 2: "/posts/1"
          const to = `/${pathnames.slice(0, index + 1).join("/")}`;
          const isLast = index === pathnames.length - 1;

          return isLast ? (
            // Chặng cuối cùng (Trang hiện tại) -> Active và không cho click nữa
            <Breadcrumb.Item active key={to}>
              {getBreadcrumbName(value)}
            </Breadcrumb.Item>
          ) : (
            // Chặng giữa -> Cho phép click để quay lại nhanh
            <Breadcrumb.Item key={to} linkAs={Link} linkProps={{ to: to }}>
              {getBreadcrumbName(value)}
            </Breadcrumb.Item>
          );
        })}
      </Breadcrumb>
    </Container>
  );
}

export default DynamicBreadcrumb;