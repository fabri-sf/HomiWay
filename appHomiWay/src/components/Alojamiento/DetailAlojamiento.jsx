import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import AlojamientoService from "../../services/AlojamientoService";

import { ListServicios } from "../Servicios/ListServicio";
import Resena from "../Resena/Resena";
import ResenaAlojamiento from "../Resena/ResenaAlojamiento";

import { useCart } from "../../hooks/useCart";
import { useNavigate } from "react-router-dom";

import { Button, Typography, CircularProgress, Box } from "@mui/material";

import { useTranslation } from "react-i18next";

import { useContext } from "react";
import toast from "react-hot-toast";
import { UserContext } from "../../context/UserContext";

export function DetailAlojamiento() {
  const { t } = useTranslation();
  const { addAlojamiento } = useCart();
  const { userData } = useContext(UserContext);
  const isAuthenticated = Boolean(userData && userData.id);
  const navigate = useNavigate();

  const { id } = useParams();
  const [data, setData] = useState(null);
  const [error, setError] = useState("");
  const [loaded, setLoaded] = useState(false);
  const [showAll] = useState(false);
  const BASE_URL = import.meta.env.VITE_BASE_URL + "uploads";

  const { addItem } = useCart();

  useEffect(() => {
    AlojamientoService.getAlojamientoById(id)
      .then((res) => {
        setData(res.data);
        setLoaded(true);
        setError("");
      })
      .catch((err) => {
        setError(err.message || t("alojamientos.detail.errors.fetch"));
        setLoaded(false);
      });
  }, [id, t]);

  if (!loaded) {
    return (
      <Box
        sx={{
          minHeight: "60vh",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#fafaf7",
          color: "#2E7D32",
        }}
      >
        <CircularProgress size={60} sx={{ color: "#2E7D32", mb: 2 }} />
        <Typography variant="h6">{t("alojamientos.detail.loading")}</Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ padding: "2rem" }}>
        <Typography color="error">
          {t("alojamientos.detail.errors.prefix")} {error}
        </Typography>
      </Box>
    );
  }

  return (
    <div style={{ maxWidth: "1000px", margin: "2rem auto", padding: "1rem" }}>
      <h1 className="text-center mb-4">{data.Nombre}</h1>

      {Array.isArray(data.imagenes) && data.imagenes.length > 0 ? (
        <div
          id="carouselAlojamiento"
          className="carousel slide mb-4"
          data-bs-ride="carousel"
        >
          <div className="carousel-indicators">
            {data.imagenes.map((_, i) => (
              <button
                key={i}
                type="button"
                data-bs-target="#carouselAlojamiento"
                data-bs-slide-to={i}
                className={i === 0 ? "active" : ""}
                aria-current={i === 0 ? "true" : undefined}
                aria-label={`${t("alojamientos.cards.imageAlt", { num: i + 1 })}`}
              ></button>
            ))}
          </div>
          <div className="carousel-inner">
            {data.imagenes.map((img, i) => (
              <div
                key={i}
                className={`carousel-item ${i === 0 ? "active" : ""}`}
              >
                <img
                  src={`${BASE_URL}/${img.url}`}
                  className="d-block w-100"
                  alt={t("alojamientos.cards.imageAlt", { num: i + 1 })}
                  style={{
                    height: "400px",
                    objectFit: "cover",
                    borderRadius: "8px",
                  }}
                />
              </div>
            ))}
          </div>
          <button
            className="carousel-control-prev"
            type="button"
            data-bs-target="#carouselAlojamiento"
            data-bs-slide="prev"
          >
            <span className="carousel-control-prev-icon" aria-hidden="true" />
            <span className="visually-hidden">
              {t("alojamientos.cards.prev")}
            </span>
          </button>
          <button
            className="carousel-control-next"
            type="button"
            data-bs-target="#carouselAlojamiento"
            data-bs-slide="next"
          >
            <span className="carousel-control-next-icon" aria-hidden="true" />
            <span className="visually-hidden">
              {t("alojamientos.cards.next")}
            </span>
          </button>
        </div>
      ) : (
        <p>
          <em>{t("alojamientos.detail.noImages")}</em>
        </p>
      )}

      <div style={{ lineHeight: 1.8 }}>
        <p>
          <strong>{t("alojamientos.create.labels.precioNoche")}:</strong> ₡
          {data.PrecioNoche}
        </p>
        <p>
          <strong>{t("alojamientos.create.labels.capacidad")}:</strong>{" "}
          {data.Capacidad} personas
        </p>
        <p>
          <strong>{t("alojamientos.create.labels.category")}:</strong>{" "}
          {data.Categoria || "—"}
        </p>
        <p>
          <strong>{t("alojamientos.create.labels.features")}:</strong>{" "}
          {data.Caracteristicas || "—"}
        </p>
        <p>
          <strong>{t("alojamientos.detail.location")}:</strong>{" "}
          {data.ubicacion
            ? `${data.ubicacion.Direccion}, ${data.ubicacion.Distrito}, ${data.ubicacion.Canton}, ${data.ubicacion.Provincia}`
            : t("alojamientos.detail.locationUnavailable")}
        </p>
        <p>
          <strong>{t("alojamientos.create.labels.postalCode")}:</strong>{" "}
          {data.ubicacion?.CodigoPostal || "—"}
        </p>
        <p>
          <strong>{t("alojamientos.create.labels.descripcion")}:</strong>
        </p>
        <p style={{ textAlign: "justify" }}>{data.Descripcion}</p>
      </div>

      <hr style={{ margin: "2rem 0" }} />
      <ListServicios alojamientoId={parseInt(data.ID)} />

      <Button

        size="small"
        onClick={() => {
          addAlojamiento({
            id: data.ID,
            image: `${BASE_URL}/${data.imagenes[0].url}`,
            name: data.Nombre,
            price: data.PrecioNoche,
          });
        }}
        sx={{
          backgroundColor: "#2e7d32",
          color: "#ffffff",
          "&:hover": { backgroundColor: "#1b5e20" },
          marginTop: "1rem",
        }}
      >
        {t("alojamientos.detail.buttons.reserve")}
      </Button>


      <Resena alojamientoId={parseInt(data.ID)} />

      <Button
        size="small"
        component={Link}
        to={`/resena/crear/${data.ID}`}
        sx={{
          backgroundColor: "#2e7d32",
          color: "#ffffff",
          "&:hover": { backgroundColor: "#1b5e20" },
          margin: "1rem",
        }}
      >
        {t("alojamientos.detail.buttons.rate")}
      </Button>

      <Button
        size="small"
        component={Link}
        to={`/resena/alojamiento/${data.ID}`}
        sx={{
          backgroundColor: "#388e3c",
          color: "#ffffff",
          "&:hover": { backgroundColor: "#2e7d32" },
          margin: "1rem",
        }}
      >
        {t("alojamientos.detail.buttons.viewAllReviews")}
      </Button>

      {showAll && <ResenaAlojamiento alojamientoId={parseInt(data.ID)} />}
    </div>
  );
}
