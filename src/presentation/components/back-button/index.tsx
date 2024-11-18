import React from "react";
import { useNavigate } from "react-router-dom";
import { IoMdArrowDropleft } from "react-icons/io";
import "./styles.css";

interface BackButtonProps {
  backRoute?: string;
  title?: string;
  onClick?: () => void;
}

const BackButton: React.FC<BackButtonProps> = ({
  backRoute,
  title = "Voltar",
}) => {
  const navigate = useNavigate();

  const handleBack = () => {
    if (backRoute) {
      navigate(backRoute);
    } else {
      navigate(-1);
    }
  };

  return (
    <button onClick={handleBack} className="back-button" aria-label={title}>
      <IoMdArrowDropleft size={26} color="d31313" />
      <span className="back-button-text">{title}</span>
    </button>
  );
};

export default BackButton;
