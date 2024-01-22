"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import api from "../services/api";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  notifyInfo,
  notifySuccess,
  notifyError,
} from "../services/notification";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import ErrorMessage from "@/components/Form/error-message";

export default function Home() {
  const LoginSchema = z.object({
    email: z.string().email({ message: "Email Inválido!" }),
    password: z.string().min(6, "A senha tem que ter no mínimo 6 caracteres!")
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue
  } = useForm({
    resolver: zodResolver(LoginSchema),
  });

  function SetCookie(name: string, value: string) {
    Cookies.set(name, value);
  }

  const resetPasswordField = () => {
    setValue("password", null);
  };

  const onSubmit = async (data) => {
    resetPasswordField()

    notifyInfo("Entrando...");

    api
      .post("/auth/login", {
        email: data.email,
        password: data.password
      })
      .then((res) => {
        if (res.status === 200) {
          notifySuccess("Login Realizado!");
          SetCookie("jwt", res.data.token);
        }
      })
      .catch((err) => {
        if (err.response.status === 404) {
          notifyError("Usuario nao encontrado");
          return
        }

        if (err.response.status === 401) {
          console.log("Bateu");
          notifyError("Senha incorreta");
          return
        }

        notifyError("Ocorreu um erro inesperado ao servidor, tente novamente mais tarde!");
      });
  };

  return (
    <div className="flex w-full min-h-screen bg-gradient-to-r from-GRAY to-LOW_PURPLE items-center justify-center px-2 py-20">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col w-full max-w-lg p-6 sm:px-12 sm:py-6 bg-white rounded-[5px] sm:rounded-[10px]  shadow-xl"
      >
        <h1 className="text-4xl my-2">
          Insira suas Credenciais
        </h1>
        <input
          className="mt-8 border-0 border-b-2 border-BLACK focus:ring-0"
          type="email"
          placeholder="E-mail"
          {...register("email")}
        />
        <ErrorMessage error={errors.email} />
        <input
          className="mt-8 border-0 border-b-2 border-BLACK focus:ring-0"
          type="password"
          placeholder="Senha"
          {...register("password")}
        />
        <p className="mt-4 text-sm">
          Esqueceu a senha? <a className="text-LOW_BLUE underline font-bold" href="#">Recuperar</a>
        </p>
        <p className="max-w-80 text-xs mt-8">
          Ao clicar em &quotPróximo&quot e continuar com o seu cadastro, você está concordando com a nossa <a className="text-BLACK underline font-bold" href="#">Política de Privacidade</a>.
        </p>
        <div>
          <button className="mx-auto my-6 w-1/2 min-w-30 bg-gray-400 text-white text-xl py-2 rounded-[25px]">
            Criar Conta
          </button>
          <button className="mx-auto my-6 w-1/2 min-w-30 bg-LOW_BLUE text-white text-xl font-bold py-2 rounded-[25px]" type="submit">
            Entrar
          </button>
        </div>
      </form >
      <ToastContainer />
    </div >
  );
}
