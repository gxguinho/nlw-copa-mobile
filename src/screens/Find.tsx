import { useNavigation } from "@react-navigation/native";
import { Heading, useToast, VStack } from "native-base";
import { Header } from "../components/Header";

import { useState } from "react";
import { Button } from "../components/Button";
import { Input } from "../components/Input";
import { api } from "../services/api";

export function Find() {
  const toast = useToast();
  const { navigate } = useNavigation();

  const [code, setCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function handleJoinPool() {
    try {
      setIsLoading(true);

      if (!code.trim()) {
        return toast.show({
          title: "Informe o código ",
          placement: "top",
          bgColor: "red.500"
        });
      }

      const response = await api.post("/pools/join", { code });

      toast.show({
        title: "Você entrou no bolão com sucesso!",
        placement: "top",
        bgColor: "green.500"
      });

      navigate("pools");
    } catch (error) {
      setIsLoading(false);
      if (error.response?.data?.message === "Pool not found") {
        return toast.show({
          title: "Bolão não encontrado",
          placement: "top",
          bgColor: "red.500"
        });
      }

      if (error.response?.data?.message === "You already joined this pool") {
        return toast.show({
          title: "Você já está nesse bolão",
          placement: "top",
          bgColor: "red.500"
        });
      }

      toast.show({
        title: "Não foi possível encontrar o bolão",
        placement: "top",
        bgColor: "red.500"
      });
    }
  }

  return (
    <VStack flex={1} bg="gray.900">
      <Header title="Buscar por código" showBackButton />

      <VStack mt={8} mx={5} alignItems="center">
        <Heading fontFamily="heading" color="white" fontSize="xl" my={8} textAlign="center">
          Encontre um bolão através de{"\n"} seu código único
        </Heading>

        <Input
          mb={2}
          placeholder="Qual o código do bolão?"
          autoCapitalize="characters"
          onChangeText={setCode}
          value={code}
        />
        <Button title="BUSCAR BOLÃO" isLoading={isLoading} onPress={handleJoinPool} />
      </VStack>
    </VStack>
  );
}
