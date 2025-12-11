import java.util.*;

public class Investigacao {

    static class Pessoa {
        String nome;
        List<Pessoa> possiveisFontes = new ArrayList<>();

        Pessoa(String nome) {
            this.nome = nome;
        }

        void addFonte(Pessoa p) {
            possiveisFontes.add(p);
        }

        void mostrarFontes() {
            System.out.println("Fontes possíveis sobre " + nome + ":");
            if (possiveisFontes.isEmpty()) {
                System.out.println("  Nenhuma fonte conhecida.");
                return;
            }
            possiveisFontes.forEach(f -> System.out.println("  -> " + f.nome));
        }
    }

    public static void main(String[] args) {

        Pessoa voces = new Pessoa("Vocês");
        Pessoa filhaPastor = new Pessoa("Filha do Pastor");
        Pessoa sede = new Pessoa("Pessoal da Sede");
        Pessoa pastorLocal = new Pessoa("Pastor Local");
        Pessoa pastorPresidente = new Pessoa("Pastor Presidente");

        // ligações reais
        filhaPastor.addFonte(voces);
        sede.addFonte(filhaPastor);

        // possibilidade de fofoca
        pastorLocal.addFonte(sede);

        // ligação duvidosa (pastor local pode ter mentido)
        pastorPresidente.addFonte(pastorLocal);

        // exibir relações
        voces.mostrarFontes();
        filhaPastor.mostrarFontes();
        sede.mostrarFontes();
        pastorLocal.mostrarFontes();

        System.out.println("\n*** Ligação com presidente é incerta ***");
        pastorPresidente.mostrarFontes();
    }
}
