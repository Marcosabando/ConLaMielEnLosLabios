import { useEffect, useState } from "react";
import "./styles.css";
import { fetchData } from "../../helpers/axiosHelper";
import { useTranslation } from "react-i18next";

const CategoryList = () => {
  const { t } = useTranslation();

  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState("create");
  const [categoryName, setCategoryName] = useState("");
  const [editingCategoryId, setEditingCategoryId] = useState(null);

  useEffect(() => {
    dataCategories();
  }, []);

  const dataCategories = async () => {
    try {
      setLoading(true);
      const res = await fetchData("/categories/get", "GET");
      setCategories(
        Array.isArray(res.data) ? res.data : res.data.categories || []
      );
      setError(null);
    } catch (error) {
      setError(t("error") + ": " + (error.message || t("loading_error")));
    } finally {
      setLoading(false);
    }
  };

  const openModal = (type, category = null) => {
    setModalType(type);
    setCategoryName(category ? category.name : "");
    setEditingCategoryId(category ? category.category_id || category.id : null);
    setShowModal(true);
  };

  const handleSave = async () => {
    if (!categoryName.trim()) return;

    try {
      if (modalType === "create") {
        await fetchData("/categories/create", "POST", { name: categoryName });
      } else {
        await fetchData(`/categories/update/${editingCategoryId}`, "PUT", {
          name: categoryName,
        });
      }
      setShowModal(false);
      setCategoryName("");
      setEditingCategoryId(null);
      dataCategories();
    } catch (error) {
      setError(
        `${t("error")} ${
          modalType === "create" ? t("add") : t("update")
        } categoría: ${error.message}`
      );
    }
  };

  const handleDelete = async (id) => {
    try {
      await fetchData(`/categories/delete/${id}`, "DELETE");
      dataCategories();
    } catch (error) {
      setError(
        `${t("error")} ${t("delete")} categoría: ` +
          (error.message || t("error"))
      );
    }
  };

  return (
    <div className="category-list">
      <h2>{t("categories")}</h2>

      {showModal && (
        <div className="modal">
          <h3>
            {modalType === "create" ? t("add_category") : t("edit_category")}
          </h3>
          <input
            type="text"
            className="category-input"
            placeholder={t("category_name_placeholder")}
            value={categoryName}
            onChange={(e) => setCategoryName(e.target.value)}
          />
          <div className="buttonsModal">
            <button className="save-btn" onClick={handleSave}>
              {modalType === "create" ? t("save") : t("update")}
            </button>
            <button className="cancel-btn" onClick={() => setShowModal(false)}>
              {t("cancel")}
            </button>
          </div>
        </div>
      )}

      <button className="add-category-btn" onClick={() => openModal("create")}>
        {t("add_category")}
      </button>

      {loading && <p className="loading">{t("loading_categories")}</p>}
      {error && <p className="error">{error}</p>}

      <table className="category-table" border="1">
        <thead>
          <tr>
            <th className="idTh">ID</th>
            <th>{t("name")}</th>
            <th className="actionTh">{t("actions")}</th>
          </tr>
        </thead>
        <tbody>
          {categories.length > 0 ? (
            categories.map((category) => (
              <tr key={category.category_id || category.id}>
                <td>{category.category_id || category.id}</td>
                <td>{category.name}</td>
                <td className="buttonsTable">
                  <button
                    className="edit-btn"
                    onClick={() => openModal("edit", category)}
                  >
                    <img src="/icons/edit.svg" alt="edit icon" />
                  </button>
                  <button
                    className="delete-btn"
                    onClick={() =>
                      handleDelete(category.category_id || category.id)
                    }
                  >
                    <img src="/icons/bin.svg" alt="delete icon" />
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="3">{t("no_categories")}</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default CategoryList;
