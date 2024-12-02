import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./styles.css";
import CircularProgress from "@mui/material/CircularProgress";
import Input from "../../../../components/input";
import DataTable, { TableStyles } from "react-data-table-component";
import { IoEyeOutline } from "react-icons/io5";
import api from "../../../../../services/api";
import { toast } from "react-toastify";

interface ClientData {
  id_cliente: number;
  cnpjCliente: string;
  razaoSocial: string;
  nmFantasia: string;
  cdClienteExterno: string;
  nmEmpresa?: string;
}

function ListClientPage() {
  const navigate = useNavigate();
  const [clients, setClients] = useState<ClientData[]>([]);
  const [filters, setFilters] = useState({
    razaoSocial: "",
    cnpjCliente: "",
    codigoCliente: "",
    filial: "",
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalRows, setTotalRows] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const isFiltered =
    filters.razaoSocial ||
    filters.cnpjCliente ||
    filters.codigoCliente ||
    filters.filial;

  const columns = [
    {
      name: "Cód Cliente",
      selector: (row: ClientData) => row.cdClienteExterno || "N/A",
    },
    {
      name: "Razão Social",
      selector: (row: ClientData) => row.razaoSocial || "N/A",
    },
    {
      name: "CNPJ",
      selector: (row: ClientData) => row.cnpjCliente || "N/A",
    },
    {
      name: "Filial",
      selector: (row: ClientData) => row.nmEmpresa || "N/A",
    },
    {
      name: "Detalhes",
      cell: (row: ClientData) => (
        <div
          className="detail-btn"
          onClick={() => navigate(`/clients/detail/${row.cnpjCliente}`)}
        >
          <IoEyeOutline />
        </div>
      ),
    },
  ];

  const customStyles: TableStyles = {
    headCells: {
      style: {
        backgroundColor: "#010101",
        color: "white",
        fontSize: "16px",
        justifyContent: "center",
        position: "sticky",
        top: 0,
        zIndex: 1,
      },
    },
    cells: {
      style: {
        fontSize: "15px",
        padding: "4px",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      },
    },
    rows: {
      style: {
        "&:hover": {
          backgroundColor: "#f0f0f0",
        },
      },
    },
    pagination: {
      style: {
        color: "#010101",
        backgroundColor: "#fcfcfc",
      },
      pageButtonsStyle: {
        color: "#010101",
        fill: "#010101",
        ":hover:not(:disabled)": {},
        ":focus": {
          outline: "none",
        },
      },
    },
  };

  const fetchClients = async () => {
    setIsLoading(true);

    try {
      let response;

      if (isFiltered) {
        response = await api.post("/api/customer/findCustomer", {
          razaoSocial: filters.razaoSocial.trim() || undefined,
          cnpjCliente: filters.cnpjCliente.trim() || undefined,
          codigoCliente: filters.codigoCliente.trim() || undefined,
          filial: filters.filial.trim() || undefined,
        });

        const data = response.data;
        setClients(Array.isArray(data) ? data : [data]);
        setTotalRows(Array.isArray(data) ? data.length : 1);
      } else {
        response = await api.get("/api/customer/findAll", {
          params: {
            page: currentPage - 1,
            size: rowsPerPage,
          },
        });

        const data = response.data;
        setClients(data?.content || []);
        setTotalRows(data?.totalElements || 0);
      }
    } catch (error: any) {
      toast.error("Erro ao carregar clientes. Tente novamente.", {
        position: "bottom-right",
        autoClose: 5000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchClients();
  }, [currentPage, rowsPerPage]); // Refetch ao mudar página ou linhas por página

  const handleFilterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1); // Resetar para a primeira página ao filtrar
    setHasSearched(true); // Indica que a pesquisa foi realizada
    fetchClients();
  };

  return (
    <div className="client-page">
      <section className="content">
        <form className="filter-form" onSubmit={handleFilterSubmit}>
          <h2>Filtros avançados</h2>
          <div className="form-row">
            <Input
              label="Razão Social"
              placeholder="Razão Social"
              name="razaoSocial"
              value={filters.razaoSocial}
              onChange={(e) =>
                setFilters({ ...filters, razaoSocial: e.target.value })
              }
            />
            <Input
              label="CNPJ"
              placeholder="CNPJ"
              name="cnpjCliente"
              value={filters.cnpjCliente}
              onChange={(e) =>
                setFilters({ ...filters, cnpjCliente: e.target.value })
              }
            />
            <Input
              label="Cód Cliente"
              placeholder="Cód Cliente"
              name="codigoCliente"
              value={filters.codigoCliente}
              onChange={(e) =>
                setFilters({ ...filters, codigoCliente: e.target.value })
              }
            />
            <Input
              label="Filial"
              select
              value={filters.filial}
              name="filial"
              onChange={(e) =>
                setFilters({ ...filters, filial: e.target.value })
              }
              options={[
                { value: "", label: "Todos" },
                { value: "Filial 1", label: "Filial 1" },
                { value: "Filial 2", label: "Filial 2" },
              ]}
            />
          </div>
          <div className="form-actions">
            <button
              type="button"
              className="btn-reset"
              onClick={() =>
                setFilters({
                  razaoSocial: "",
                  cnpjCliente: "",
                  codigoCliente: "",
                  filial: "",
                })
              }
            >
              Limpar Filtros
            </button>
            <button type="submit" className="btn-submit">
              Pesquisar
            </button>
          </div>
        </form>

        <div className="table">
          <h2>Relatório de Contas</h2>

          {/* Condicionalmente renderizando a tabela ou a mensagem */}
          {hasSearched ? (
            isLoading ? (
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  minHeight: "300px", // Ajuste o valor conforme necessário
                }}
              >
                <CircularProgress style={{ color: "red" }} size={80} />
              </div>
            ) : (
              <DataTable
                columns={columns}
                data={clients}
                pagination={!isFiltered} // Paginação apenas para listagem geral
                paginationServer={!isFiltered} // Apenas para API GET
                paginationTotalRows={!isFiltered ? totalRows : undefined}
                paginationPerPage={rowsPerPage}
                paginationDefaultPage={currentPage}
                onChangeRowsPerPage={(newRowsPerPage) =>
                  setRowsPerPage(newRowsPerPage)
                }
                onChangePage={(newPage) => setCurrentPage(newPage)}
                customStyles={customStyles}
                noDataComponent={
                  <div
                    style={{
                      textAlign: "center",
                      color: "#000",
                      padding: "20px",
                    }}
                  >
                    Nenhum registro encontrado, faça uma nova pesquisa.
                  </div>
                }
              />
            )
          ) : (
            <div
              style={{
                textAlign: "center",
                color: "#000",
                padding: "20px",
              }}
            >
              Faça uma pesquisa para ver os resultados.
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

export default ListClientPage;
