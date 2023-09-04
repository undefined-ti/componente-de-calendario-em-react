"use client";
import Image from "next/image";
import styles from "./page.module.css";
import Accordion from "@mui/material/Accordion";
import AccordionDetails from "@mui/material/AccordionDetails";
import AccordionSummary from "@mui/material/AccordionSummary";
import Typography from "@mui/material/Typography";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import TextField, { OutlinedTextFieldProps } from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import React, { useEffect, useRef, useState } from "react";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import CircleIcon from "@mui/icons-material/Circle";
import SquareIcon from "@mui/icons-material/Square";
import { log } from "console";

export default function Home() {
  const [draggedHospede, setDraggedHospede] = useState("");

  const [reservations, setReservations] = useState([
    {
      IdReserva: 1,
      Cliente: "Hospede 1",
      IdImovel: 1,
      NomeHotel: "Fiore Prime",
      IdHotel: 1,
      CheckIn: "2023-08-01T12:00:00",
      CheckOut: "2023-08-03T12:00:00",
      Status: "Bloqueado",
    },

    {
      IdReserva: 2,
      Cliente: "Hospede 2",
      IdImovel: 1,
      NomeHotel: "Fiore Prime",
      IdHotel: 1,
      CheckIn: "2023-07-28T12:00:00",
      CheckOut: "2023-07-30T12:00:00",
      Status: "Confirmada",
    },

    {
      IdReserva: 3,
      Cliente: "Hospede 3",
      IdImovel: 2,
      NomeHotel: "Fiore Prime",
      IdHotel: 1,
      CheckIn: "2023-08-05T12:00:00",
      CheckOut: "2023-08-06T12:00:00",
      Status: "Manutenção",
    },

    {
      IdReserva: 4,
      Cliente: "Hospede 4",
      IdImovel: 3,
      NomeHotel: "Fiore Prime",
      IdHotel: 1,
      CheckIn: "2023-07-29T12:00:00",
      CheckOut: "2023-08-01T12:00:00",
      Status: "Pendente",
    },

    {
      IdReserva: 5,
      Cliente: "Hospede 5",
      IdImovel: 4,
      NomeHotel: "Fiore Prime",
      IdHotel: 1,
      CheckIn: "2023-07-29T12:00:00",
      CheckOut: "2023-08-01T12:00:00",
      Status: "Financeiro Aberto",
    },
  ]);

  const [bedrooms, setBedrooms] = useState([
    {
      IdImovel: 1,
      NomeQuarto: "QUARTO 1",
    },
    {
      IdImovel: 2,
      NomeQuarto: "QUARTO 2",
    },
    {
      IdImovel: 3,
      NomeQuarto: "QUARTO 3",
    },
    {
      IdImovel: 4,
      NomeQuarto: "QUARTO 4",
    },
  ]);

  const reservationsByBedrooms: any = {};
  // Inicializa as listas de reservas para cada quarto
  bedrooms.forEach((bedrooms) => {
    reservationsByBedrooms[bedrooms.IdImovel] = [];
  });
  // Preenche as listas de reservas para cada quarto
  reservations.forEach((reservation) => {
    const { IdImovel } = reservation;
    reservationsByBedrooms[IdImovel].push(reservation);
  });

  const groupedReservationsList = Object.values(reservationsByBedrooms);

  const dataInicio: any = new Date("2023-07-26T12:00:00");
  const dataFim: any = new Date("2023-08-30T12:00:00");

  const mesesAbreviados = [
    "Jan",
    "Fev",
    "Mar",
    "Abr",
    "Mai",
    "Jun",
    "Jul",
    "Ago",
    "Set",
    "Out",
    "Nov",
    "Dez",
  ];
  const diasAbreviados = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];

  const intervalo = Math.floor((dataFim - dataInicio) / (1000 * 60 * 60 * 24));

  const datasIntervalo: any = [];

  for (let i = 0; i <= intervalo; i++) {
    const data = new Date(dataInicio);
    data.setDate(dataInicio.getDate() + i);
    datasIntervalo.push(data);
  }

  // console.log(datasIntervalo);

  const dayWidth = 60;

  const [accordionOpen, setAccordionOpen] = useState(true);
  const [dragging, setDragging] = useState(false);
  const [dragStartX, setDragStartX] = useState(0);
  const [dragStartScrollLeft, setDragStartScrollLeft] = useState(0);

  const div2 = useRef<HTMLDivElement[]>([]);
  const div1: any = useRef<HTMLDivElement>(null);

  const onScroll = () => {
    div2.current.forEach((current) => {
      if (current) {
        current.scrollLeft = div1.current?.scrollLeft || 0;
      }
    });
  };

  const handleMouseDownDiv = (event: any) => {
    setDragging(true);
    setDragStartX(event.clientX);
    setDragStartScrollLeft(div1.current.scrollLeft);
  };

  const handleMouseMove = (event: any) => {
    if (dragging) {
      const offsetX = event.clientX - dragStartX;
      div1.current.scrollLeft = dragStartScrollLeft - offsetX;
    }
  };

  const handleMouseUp = () => {
    setDragging(false);
  };

  const handleMouseLeave = () => {
    setDragging(false);
  };

  const handleMouseDown = (
    event: any,
    isCheckIn: any,
    reservationIndex: any
  ) => {
    event.preventDefault();

    const reservation: any = reservations.find(
      (reservation) => reservation.IdReserva === reservationIndex.IdReserva
    );

    const checkInDate = new Date(reservation.CheckIn);
    const checkOutDate = new Date(reservation.CheckOut);

    const checkInIndex = datasIntervalo.findIndex(
      (date: any) => date.getTime() === checkInDate.getTime()
    );
    const checkOutIndex = datasIntervalo.findIndex(
      (date: any) => date.getTime() === checkOutDate.getTime()
    );

    const startX = event.clientX;
    const startLeft = (isCheckIn ? checkInIndex : checkOutIndex) * dayWidth;

    const handleMouseMove = (event: any) => {
      const offsetX = event.clientX - startX;
      const newLeft = offsetX + startLeft;
      const newDay = Math.max(
        0,
        Math.min(datasIntervalo.length, Math.floor(newLeft / dayWidth))
      );

      let checkInDate: number;
      let checkOutDate: number;

      if (isCheckIn) {
        checkInDate = newDay;
        checkOutDate = Math.max(checkOutIndex, newDay);
      } else {
        checkInDate = Math.min(checkInIndex, newDay);
        checkOutDate = newDay;
      }

      setReservations((reservation) => {
        reservation.forEach((_reservation) => {
          if (
            _reservation.IdReserva === reservationIndex.IdReserva &&
            checkInDate !== checkOutDate
          ) {
            _reservation.CheckIn = datasIntervalo[checkInDate];
            _reservation.CheckOut = datasIntervalo[checkOutDate];
          }
        });

        return [...reservation];
      });
    };

    const handleMouseUp = () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
  };

  const handleDayDrop = (event: any, day: any, reservationIndex: any) => {
    event.preventDefault();

    const jsonObject = JSON.parse(draggedHospede);

    const id = jsonObject.IdReserva;

    const reservation: any = reservations.find(
      (reservation) => reservation.IdReserva === id
    );

    const idImovel = jsonObject.IdImovel;

    const clientY = Math.ceil(event.clientY / 60 - 2);

    setReservations((reservation) =>
      reservation.map((_reservaton) => {
        if (_reservaton.IdReserva === id && idImovel !== clientY) {
          return {
            ..._reservaton,
            IdImovel: clientY,
          };
        }
        return _reservaton;
      })
    );

    const checkInDate = new Date(reservation.CheckIn);
    const checkOutDate = new Date(reservation.CheckOut);

    const checkInIndex = datasIntervalo.findIndex(
      (date: any) => date.getTime() === checkInDate.getTime()
    );
    const checkOutIndex = datasIntervalo.findIndex(
      (date: any) => date.getTime() === checkOutDate.getTime()
    );

    let newCheckIn = day;
    let newCheckOut = newCheckIn + (checkOutIndex - checkInIndex);

    // const check = checkDate(newCheckIn, newCheckOut);

    // if(check === true){
    //   newCheckIn = checkInIndex;
    //   newCheckOut = checkOutIndex;
    // };

    setReservations((reservation) =>
      reservation.map((_reservaton) => {
        if (_reservaton.IdReserva === id && newCheckIn !== newCheckOut) {
          return {
            ..._reservaton,
            CheckIn: datasIntervalo[newCheckIn],
            CheckOut: datasIntervalo[newCheckOut],
          };
        }
        return _reservaton;
      })
    );
  };

  const checkDate = (checkIn: any, checkOut: any) => {
    const CheckIn = checkIn;
    const CheckOut = checkOut;

    for (const reservation of reservations) {
      const reservationCheckIn = new Date(reservation.CheckIn);
      const reservationCheckOut = new Date(reservation.CheckOut);

      const checkInIndex = datasIntervalo.findIndex(
        (date: any) => date.getTime() === reservationCheckIn.getTime()
      );
      const checkOutIndex = datasIntervalo.findIndex(
        (date: any) => date.getTime() === reservationCheckOut.getTime()
      );

      // Verifica se as datas do objeto correspondem às datas de entrada
      if (CheckIn >= checkInIndex && CheckOut <= checkOutIndex) {
        return true; // Encontrou uma correspondência, retorna true
      }
    }
    return false;
  };

  const toggleAccordion = () => {
    setAccordionOpen(!accordionOpen);
  };

  const convertCheckIn = (dateIn: any) => {
    let CheckIn = new Date(dateIn);
    let convertCheckIn = datasIntervalo.findIndex(
      (date: any) => date.getTime() === CheckIn.getTime()
    );
    return convertCheckIn;
  };

  const convertCheckOut = (dateOut: any) => {
    let CheckOut = new Date(dateOut);
    let convertCheckOut = datasIntervalo.findIndex(
      (date: any) => date.getTime() === CheckOut.getTime()
    );
    return convertCheckOut;
  };

  const handleDrag = (e: any, index: any, hospede: any) => {
    const hospedeStringfy = JSON.stringify(hospede);
    setDraggedHospede(hospedeStringfy);
    console.log(e);
  };

  const addReservation = (event: any, date: any) => {
    const clientY = Math.ceil(event.clientY / 60 - 2);

    const lastReservation = reservations[reservations.length - 1];
    const lastId = lastReservation ? lastReservation.IdReserva : 0;

    const newId = lastId + 1;

    const newReservation = {
      IdReserva: newId,
      Cliente: `Hospede ${newId}`,
      IdImovel: clientY,
      NomeHotel: "Fiore Prime",
      IdHotel: 1,
      CheckIn: datasIntervalo[date],
      CheckOut: datasIntervalo[date + 1],
      Status: "Bloqueado",
    };

    const newReservations = [...reservations];

    newReservations.push(newReservation);

    setReservations(newReservations);
  };

  const allowDrop = (event: any) => {
    event.preventDefault();
  };

  const getStatusColorAndName = (status: any) => {
    switch (status) {
      case "Bloqueado":
        return "solid 4px green";
      case "Confirmada":
        return "solid 4px blue";
      case "Manutenção":
        return "solid 4px #616161";
      case "Pendente":
        return "solid 4px yellow";
      case "Financeiro Aberto":
        return "solid 4px red";
      default:
        return { color: "", name: "" };
    }
  };

  // Atualiza a posição do scroll ao renderizar
  useEffect(() => {
    if (accordionOpen) onScroll();
  }, [accordionOpen]);

  return (
    <main className={styles.main} style={{ backgroundColor: "white" }}>
      <div style={{ display: "flex" }}>
        <div style={{ display: "flex" }}>
          <div
            style={{
              width: "10rem",
              backgroundColor: "#fff",
              borderRight: "solid 3px #ccc",
            }}
          ></div>
          <div
            style={{
              display: "flex",
              width: "68rem",
              overflow: "auto",
              cursor: "pointer",
            }}
            ref={div1}
            onScroll={onScroll}
            onMouseDown={handleMouseDownDiv}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseLeave}
          >
            <div className={styles.calendar}>
              <div className={styles.daysContainer}>
                {datasIntervalo.map((date: any, index: any) => (
                  <div
                    key={index}
                    className={`${styles.day} ${styles.draggingOver}`}
                    style={{
                      backgroundColor:
                        diasAbreviados[date.getDay()] === "Dom" ||
                        diasAbreviados[date.getDay()] === "Sáb"
                          ? "#F0F8FF"
                          : "white",
                    }}
                  >
                    <span style={{ userSelect: "none" }}>
                      {mesesAbreviados[date.getMonth()]}
                    </span>
                    <span style={{ textAlign: "center", userSelect: "none" }}>
                      {date.getDate()}
                    </span>
                    <span style={{ userSelect: "none" }}>
                      {diasAbreviados[date.getDay()]}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div
        onClick={toggleAccordion}
        style={{
          height: "2.5rem",
          display: "flex",
          justifyContent: "flex-start",
          background: "#fff",
          alignItems: "center",
          borderTop: "solid 1px #ccc",
          fontSize: "14px",
          borderBottom: "solid 1px #ccc",
        }}
      >
        <ArrowDropDownIcon></ArrowDropDownIcon>
        Fiore Prime
      </div>
      {accordionOpen && (
        <div style={{ display: "flex", flexDirection: "column" }}>
          {groupedReservationsList.map((hospedes: any, index: any) => {
            return (
              <div
                key={index}
                style={{
                  display: "flex",
                  transition: "opacity 0.5s ease-in-out",
                }}
              >
                <div
                  style={{
                    width: "20rem",
                    backgroundColor: "#fff",
                    borderRight: "solid 3px #ccc",
                    borderTop: "solid 1px #ccc",
                    borderBottom: "solid 1px #ccc",
                    display: "flex",
                    justifyContent: "end",
                    flexDirection: "column",
                    fontSize: "13px",
                  }}
                >
                  <span>Quarto {index + 1}</span>
                </div>
                <div
                  style={{ display: "flex", overflow: "hidden" }}
                  ref={(element) => {
                    console.log("entrei aqui");
                    div2.current[index] = element as any;
                  }}
                  onScroll={onScroll}
                >
                  <div className={styles.calendar}>
                    <div className={styles.daysContainer}>
                      {datasIntervalo.map((date: any, index: any) => {
                        return (
                          <div
                            key={index}
                            className={`${styles.day} ${styles.draggingOver}`}
                            onDragOver={(event) => allowDrop(event)}
                            onDrop={(event) =>
                              handleDayDrop(event, index, draggedHospede)
                            }
                            onClick={(event) => addReservation(event, index)}
                            style={{
                              backgroundColor:
                                diasAbreviados[date.getDay()] === "Dom" ||
                                diasAbreviados[date.getDay()] === "Sáb"
                                  ? "#F0F8FF"
                                  : "white",
                            }}
                          >
                            <span className={styles.clipPath}>
                              {mesesAbreviados[date.getMonth()]}
                            </span>
                            <span
                              className={styles.clipPath}
                              style={{ textAlign: "center" }}
                            >
                              {date.getDate()}
                            </span>
                            <span className={styles.clipPath}>
                              {diasAbreviados[date.getDay()]}
                            </span>
                          </div>
                        );
                      })}

                      {hospedes.map((reservation: any, indexador: any) => (
                        <div
                          key={indexador}
                          className={`${styles.guest} ${styles.draggingGuest}`}
                          style={{
                            left: `${
                              convertCheckIn(reservation.CheckIn) * dayWidth
                            }px`,
                            width: `${
                              (convertCheckOut(reservation.CheckOut) +
                                1 -
                                convertCheckIn(reservation.CheckIn)) *
                              60
                            }px`,
                            height: `${dayWidth / 2}px`,
                            borderBottom: `${getStatusColorAndName(
                              reservation.Status
                            )}`,
                            cursor: "move",
                            display: "flex",
                            position: "absolute",
                            justifyContent: "space-between",
                          }}
                          draggable
                          onDrag={(event) =>
                            handleDrag(event, indexador, reservation)
                          }
                        >
                          <div
                            className={styles.checkInOut}
                            style={{
                              left: `0`,
                              cursor: "col-resize",
                              background: "#94bce7",
                              height: "100%",
                              width: "3px",
                            }}
                            onMouseDown={(e) =>
                              handleMouseDown(e, true, reservation)
                            }
                          ></div>
                          <span style={{ fontSize: "10px" }}>
                            {reservation.Cliente}
                          </span>
                          <div
                            className={styles.checkInOut}
                            style={{
                              left: `0`,
                              cursor: "col-resize",
                              background: "#94bce7",
                              height: "100%",
                              width: "3px",
                            }}
                            onMouseDown={(e) =>
                              handleMouseDown(e, false, reservation)
                            }
                          ></div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
      <div
        style={{
          display: "flex",
          background: "white",
          padding: "4rem",
          justifyContent: "space-evenly",
          border: "1px solid #ccc",
          margin: "2rem",
        }}
      >
        <div>
          <SquareIcon style={{ fontSize: "15px", color: "green" }}></SquareIcon>
          <span style={{ fontSize: "13px" }}>Bloqueada</span>
        </div>
        <div>
          <SquareIcon style={{ fontSize: "15px", color: "blue" }}></SquareIcon>
          <span style={{ fontSize: "13px" }}>Confirmada</span>
        </div>
        <div>
          <SquareIcon
            style={{ fontSize: "15px", color: "#616161" }}
          ></SquareIcon>
          <span style={{ fontSize: "13px" }}>Manutenção</span>
        </div>
        <div>
          <SquareIcon
            style={{ fontSize: "15px", color: "yellow" }}
          ></SquareIcon>
          <span style={{ fontSize: "13px" }}>Pendente</span>
        </div>
        <div>
          <CircleIcon style={{ fontSize: "15px", color: "red" }}></CircleIcon>
          <span style={{ fontSize: "13px" }}>Financeiro Aberto</span>
        </div>
      </div>
    </main>
  );
}
