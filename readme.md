#Blender pi
Esse é um software com intuito de execução do blender em formato de servidor utilizando raspberry pi de forma remota

##Como funciona?
Pode ser feita conexão via wifi utilizando esta api, o blender está configurado para uso de tela virtual pois o intuito é rodar apenas em servidor, porém se você deseja rodalo de forma com que possa ver a render sem precisar de um cliente apenas remova o comando xvfb run do seguinte trecho:

```  const renderCommand = `xvfb-run -a blender -b ${fbxFilePath} -o ${outputFile} -F PNG -f 1`; ```

##Quais os requisitos necessários?
Todos os testes foram feito em um raspberry pi 4 modelo B com 4gb de ram.

##Como posso rodar em meu raspberry?

1. Execute:
	```git clone https://github.com/Darthpool9900/Blender-Pi.git```

2.Após a instalação do repositório em seu terminal execute 

	```npm install```

3. Após a instalação de todas as libs execute:
	```npm run```

>[!NOTE]
>1. Algumas distros para raspberry podem estar utilzando a porta padrão em algum serviços, portando avalie a porta desejada.
>2. Todos os testes foram feitos em modelagens com menos de 5 mil polígonos, leve em consideração a quantidade de polígonos e configuração de renderização enviada ao arquivo pois você podera sofre super aquecimento em seu aparelho se não for devidamente montado.

4. Para fazer a execução de envios de arquivos pode se utilizar sofwares como postman e insomnia, criar um cliente ou caso seja de prefêrencia pode se utilizar o cliente próprio para isso neste link [aqui]https://github.com/Darthpool9900/next-pi
