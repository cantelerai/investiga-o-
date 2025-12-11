import java.util.ArrayList;
import java.util.List;

class Pessoa {
    String nome;
    String descricao;
    List<Pessoa> conexoes = new ArrayList<>();

    public Pessoa(String nome, String descricao) {
        this.nome = nome;
        this.descricao = descricao;
    }

    public void conectar(Pessoa p) {
        conexoes.add(p);
    }

    @Override
    public String toString() {
        return nome + " — " + descricao;
    }
}

public class MuralInvestigacao {
    public static void main(String[] args) {

        // Criando as pessoas (suspeitos / envolvidos)
        Pessoa jheny = new Pessoa(
            "Jheny (Filha do Pastor)",
            "Sabia previamente que vocês iriam ao show."
        );

        Pessoa sede = new Pessoa(
            "Pessoal da Sede",
            "Possível fonte da fofoca."
        );

        Pessoa grupo = new Pessoa(
            "Grupo",
            "Estavam no show. Nem todos apareceram no vídeo."
        );

        Pessoa pastorLocal = new Pessoa(
            "Pastor Local",
            "Já mentiu outras vezes. Disse que 'chegou ao presidente'."
        );

        Pessoa pastorPresidente = new Pessoa(
            "Pastor Presidente",
            "Não conhece vocês. Duvidoso que tenha falado algo."
        );

        Pessoa mauricio = new Pessoa(
            "Maurício",
            "Estava no culto e comentou sobre o assunto."
        );

        Pessoa rosa = new Pessoa(
            "Rosa",
            "Pode ter sido informada por alguém da sede."
        );

        // Criando conexões (setas do mural)
        jheny.conectar(sede);
        sede.conectar(pastorLocal);
        grupo.conectar(pastorLocal);
        pastorLocal.conectar(pastorPresidente);
        sede.conectar(rosa);
        sede.conectar(mauricio);

        // Exibir mapa
        System.out.println("===== MAPA DE INVESTIGAÇÃO =====\n");

        exibirPessoa(jheny);
        exibirPessoa(sede);
        exibirPessoa(grupo);
        exibirPessoa(pastorLocal);
        exibirPessoa(pastorPresidente);
        exibirPessoa(mauricio);
        exibirPessoa(rosa);
    }

    public static void exibirPessoa(Pessoa p) {
        System.out.println(p);
        if (!p.conexoes.isEmpty()) {
            System.out.println("  -> Conectado a:");
            for (Pessoa conexao : p.conexoes) {
                System.out.println("     - " + conexao.nome);
            }
        }
        System.out.println();
    }
}