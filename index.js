const express = require('express');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');
const cors = require('cors');
const app = express();
const port = 3000;

app.use(cors())
// Configuração do multer para armazenamento de arquivos
const upload = multer({ dest: 'uploads/' });

// Rota para upload do arquivo .blend
app.post('/upload', upload.single('blendFile'), (req, res) => {
  const file = req.file;

  if (!file) {
    return res.status(400).send('Nenhum arquivo enviado.');
  }

  const blendFilePath = path.join(__dirname, 'uploads', file.filename);

  // Diretório de saída
  const outputDir = path.join(__dirname, 'output');

  // Comando para renderizar a cena no Blender
  const blenderCommand = `xvfb-run -a blender -b ${blendFilePath} -o ${outputDir}/renderizado_ -F PNG -f 1`;

  // Executar Blender para renderizar o arquivo
  exec(blenderCommand, (err, stdout, stderr) => {
    if (err) {
      console.error(`Erro na execução do Blender: ${stderr}`);
      if (!res.headersSent) {
        return res.status(500).send('Erro ao processar o arquivo.');
      }
    } else {
      console.log('Renderização concluída:', stdout);

      // Encontrar o nome exato do arquivo gerado
      const outputFiles = fs.readdirSync(outputDir);
      const outputFileName = outputFiles.find(file => file.startsWith('renderizado_') && file.endsWith('.png'));

      if (!outputFileName) {
        return res.status(500).send('Arquivo renderizado não encontrado.');
      }

      const outputFilePath = path.join(outputDir, outputFileName);

      // Aqui não vamos enviar o arquivo, apenas concluímos o processo
      res.status(200).send('Renderização concluída. Arquivo pronto para download.');
      
      // Remover o arquivo temporário após o envio
      fs.unlink(blendFilePath, (unlinkErr) => {
        if (unlinkErr) {
          console.error(`Erro ao remover o arquivo .blend: ${unlinkErr}`);
        }
      });
    }
  });
});

// Rota para download do arquivo mais recente
app.get('/download', (req, res) => {
  const outputDir = path.join(__dirname, 'output');

  // Listar os arquivos no diretório de saída
  fs.readdir(outputDir, (err, files) => {
    if (err) {
      return res.status(500).send('Erro ao acessar os arquivos.');
    }

    // Filtra os arquivos PNG gerados pelo Blender
    const pngFiles = files.filter(file => file.startsWith('renderizado_') && file.endsWith('.png'));

    if (pngFiles.length === 0) {
      return res.status(404).send('Nenhum arquivo renderizado encontrado.');
    }

    // Ordena os arquivos por data de modificação (mais recente primeiro)
    const latestFile = pngFiles.sort((a, b) => {
      const aStat = fs.statSync(path.join(outputDir, a));
      const bStat = fs.statSync(path.join(outputDir, b));
      return bStat.mtime - aStat.mtime; // Ordena pela data de modificação
    })[0];

    // Caminho completo do arquivo mais recente
    const filePath = path.join(outputDir, latestFile);

    // Envia o arquivo para o cliente
    res.download(filePath, latestFile, (err) => {
      if (err) {
        console.error('Erro ao enviar arquivo:', err);
        return res.status(500).send('Erro ao enviar o arquivo.');
      }
    });
  });
});

// Iniciar o servidor
app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});

