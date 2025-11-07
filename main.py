"""
Sistema de Agendamento de Montagem de Móveis
Implementa EXATAMENTE o que consta nos diagramas (sequência, fluxo, casos de uso e classes).
Nada mais, nada menos.
"""

from datetime import datetime, time, date
from flask import Flask, request, jsonify, abort, render_template, url_for
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
import os
from werkzeug.utils import secure_filename

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///agendamento.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['UPLOAD_FOLDER'] = 'static/uploads'
app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024  # 16MB max file size
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif', 'webp'}

# Criar pasta de uploads se não existir
os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)

def allowed_file(filename):
    """Verifica se a extensão do arquivo é permitida"""
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

db = SQLAlchemy(app)
CORS(app)  # Permite requisições do front-end

# -----------------------------
# Modelos (baseado EXATAMENTE no diagrama de classes)
# -----------------------------

class Cliente(db.Model):
    __tablename__ = 'cliente'
    
    id = db.Column('ID_Cliente', db.Integer, primary_key=True)
    nome = db.Column('Nome', db.String, nullable=False)
    email = db.Column('Email', db.String, unique=True, nullable=False)
    senha = db.Column('Senha', db.String, nullable=False)
    telefone = db.Column('Telefone', db.String(14))
    cpf = db.Column('CPF', db.String(11))
    cep = db.Column('CEP', db.String(8))

    agendamentos = db.relationship('Agendamento', backref='cliente', lazy=True)

    def solicitarAgendamento(self):
        """Método do diagrama de classes"""
        return True
    
    def cancelarAgendamento(self):
        """Método do diagrama de classes"""
        return True


class EnderecoServico(db.Model):
    __tablename__ = 'endereco_servico'
    
    id = db.Column('ID_Endereco', db.Integer, primary_key=True)
    cliente_id = db.Column('ID_Cliente', db.Integer, db.ForeignKey('cliente.ID_Cliente'), nullable=False)
    rua = db.Column('Rua', db.String, nullable=False)
    numero = db.Column('Numero', db.String)
    bairro = db.Column('Bairro', db.String)
    cidade = db.Column('Cidade', db.String)
    complemento = db.Column('Complemento', db.String)
    tipo_local = db.Column('Tipo_Local', db.String)
    cep = db.Column('CEP', db.String(8))
    
    cliente = db.relationship('Cliente', backref='enderecos')


class Montador(db.Model):
    __tablename__ = 'montador'
    
    id = db.Column('ID_Montador', db.Integer, primary_key=True)
    nome = db.Column('Nome', db.String, nullable=False)
    email = db.Column('Email', db.String, unique=True, nullable=False)
    senha = db.Column('Senha', db.String, nullable=False)
    regiao = db.Column('Regiao_Atendimento', db.String)
    especialidade = db.Column('Especialidade', db.String)

    agendamentos = db.relationship('Agendamento', backref='montador', lazy=True)

    def aceitarAgendamento(self):
        """Método do diagrama de classes"""
        return True

    def marcarConcluido(self):
        """Método do diagrama de classes"""
        return True
    
    def estaDisponivel(self):
        """Método do diagrama de classes"""
        # Verifica se não tem agendamentos pendentes
        agendamentos_ativos = Agendamento.query.filter(
            Agendamento.montador_id == self.id,
            Agendamento.status.in_(['Pendente', 'Confirmado pelo Montador'])
        ).count()
        return agendamentos_ativos == 0


class Movel(db.Model):
    __tablename__ = 'movel'
    
    id = db.Column('ID_Movel', db.Integer, primary_key=True)
    nome = db.Column('Nome', db.String, nullable=False)
    categoria = db.Column('Categoria_Movel', db.String)
    peso_aproximado = db.Column('Peso_Aproximado', db.Float)
    numero_de_volumes = db.Column('Numero_de_Volumes', db.Integer)


class ServicoAdicional(db.Model):
    __tablename__ = 'servico_adicional'
    
    id = db.Column('ID_Servico', db.Integer, primary_key=True)
    nome = db.Column('Nome_Servico', db.String, nullable=False)
    valor_custo = db.Column('Valor_Custo', db.Float, default=0.0)
    tempo_adicional = db.Column('Tempo_Adicional', db.Integer, default=0)


class Agendamento(db.Model):
    __tablename__ = 'agendamento'
    
    id = db.Column('ID_Agendamento', db.Integer, primary_key=True)
    cliente_id = db.Column('ID_Cliente', db.Integer, db.ForeignKey('cliente.ID_Cliente'), nullable=False)
    endereco_id = db.Column('ID_Endereco', db.Integer, db.ForeignKey('endereco_servico.ID_Endereco'), nullable=False)
    montador_id = db.Column('ID_Montador', db.Integer, db.ForeignKey('montador.ID_Montador'), nullable=True)
    origem_venda = db.Column('Origem_Venda', db.String)
    valor_total_servico = db.Column('Valor_Total_Servico', db.Float, default=0.0)
    data_servico = db.Column('Data_Servico', db.Date, nullable=False)
    horario_inicio = db.Column('Horario_Inicio', db.Time, nullable=False)
    horario_fim = db.Column('Horario_Fim', db.Time, nullable=True)
    status = db.Column('Status', db.String, default='Pendente')
    descricao_movel = db.Column('Descricao_Movel', db.Text, nullable=True)  # Descrição do móvel a ser montado
    servicos_adicionais = db.Column('Servicos_Adicionais', db.Text, nullable=True)  # Serviços adicionais solicitados pelo cliente
    fotos_conclusao = db.Column('Fotos_Conclusao', db.Text, nullable=True)  # URLs das fotos separadas por vírgula
    observacoes_montagem = db.Column('Observacoes_Montagem', db.Text, nullable=True)  # Observações do montador

    endereco = db.relationship('EnderecoServico', backref='agendamentos')
    itens = db.relationship('ItemMontagem', backref='agendamento', lazy=True)
    servicos = db.relationship('ServicoContratado', backref='agendamento', lazy=True)

    def criarAgendamento(self):
        """Método do diagrama de classes"""
        return True
    
    def cancelarAgendamento(self):
        """Método do diagrama de classes"""
        self.status = 'Cancelado'
        db.session.commit()
        return True
    
    def atribuirMontador(self, montador_id):
        """Método do diagrama de classes"""
        self.montador_id = montador_id
        db.session.commit()
        return True

    def calcularValorTotal(self):
        """Método do diagrama de classes"""
        total_itens = sum([item.quantidade * (item.movel_preco or 0) for item in self.itens])
        total_servicos = sum([s.valor_cobrado for s in self.servicos])
        self.valor_total_servico = total_itens + total_servicos
        db.session.commit()
        return self.valor_total_servico


class ItemMontagem(db.Model):
    __tablename__ = 'item_montagem'
    
    id = db.Column(db.Integer, primary_key=True)
    agendamento_id = db.Column('ID_Agendamento', db.Integer, db.ForeignKey('agendamento.ID_Agendamento'), nullable=False)
    movel_id = db.Column('ID_Movel', db.Integer, db.ForeignKey('movel.ID_Movel'), nullable=False)
    quantidade = db.Column('Quantidade', db.Integer, default=1)
    movel_preco = db.Column('Movel_Preco', db.Float, default=0.0)
    
    movel = db.relationship('Movel')


class ServicoContratado(db.Model):
    __tablename__ = 'servico_contratado'
    
    id = db.Column(db.Integer, primary_key=True)
    agendamento_id = db.Column('ID_Agendamento', db.Integer, db.ForeignKey('agendamento.ID_Agendamento'), nullable=False)
    servico_id = db.Column('ID_Servico', db.Integer, db.ForeignKey('servico_adicional.ID_Servico'), nullable=False)
    valor_cobrado = db.Column('Valor_Cobrado', db.Float, default=0.0)
    
    servico = db.relationship('ServicoAdicional')

# Cria as tabelas
with app.app_context():
    db.create_all()


# ==================== ROTAS DE FRONT-END ====================
@app.route('/')
def login_page():
    """Página de Login/Cadastro"""
    return render_template('login.html')

@app.route('/sistema')
def sistema():
    """Página principal do sistema - Interface Web (requer login)"""
    return render_template('index.html')

@app.route('/health')
def health_check():
    """Health check endpoint para Railway"""
    return jsonify({'status': 'healthy', 'service': 'agendamento-montagem'}), 200


# -----------------------------
# Rotas (SOMENTE o que aparece nos diagramas de casos de uso)
# -----------------------------

# 1) Cadastrar-se (Cliente)
@app.route('/cadastrar', methods=['POST'])
def cadastrar_cliente():
    """Cadastrar-se - Caso de uso do diagrama
    Campos: nome, email, senha, telefone, cpf, cep
    """
    data = request.json
    
    # Validar dados obrigatórios
    if not data:
        return jsonify({'erro': 'Nenhum dado enviado'}), 400
    
    if 'email' not in data or not data['email']:
        return jsonify({'erro': 'Email é obrigatório'}), 400
    
    if 'senha' not in data or not data['senha']:
        return jsonify({'erro': 'Senha é obrigatória'}), 400
    
    if len(data['senha']) < 6:
        return jsonify({'erro': 'A senha deve ter no mínimo 6 caracteres'}), 400
    
    # Verificar se email já existe em Cliente OU Montador
    if Cliente.query.filter_by(email=data['email']).first():
        return jsonify({'erro': 'Este email já está cadastrado como Cliente'}), 400
    
    if Montador.query.filter_by(email=data['email']).first():
        return jsonify({'erro': 'Este email já está cadastrado como Montador'}), 400
    
    try:
        cliente = Cliente(
            nome=data.get('nome', ''),
            email=data['email'],
            senha=data['senha'],
            telefone=data.get('telefone'),
            cpf=data.get('cpf'),
            cep=data.get('cep')
        )
        db.session.add(cliente)
        db.session.commit()
        return jsonify({'id': cliente.id, 'email': cliente.email, 'nome': cliente.nome}), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({'erro': f'Erro ao cadastrar: {str(e)}'}), 500


# 2) Fazer login (Sistema de Loja e Cliente)
@app.route('/login', methods=['POST'])
def fazer_login():
    """Fazer login - Caso de uso do diagrama
    Campos: email, senha
    """
    data = request.json
    if not data or 'email' not in data or 'senha' not in data:
        return jsonify({'erro': 'Email e senha são obrigatórios'}), 400
    
    cliente = Cliente.query.filter_by(email=data['email']).first()
    if not cliente:
        return jsonify({'erro': 'Usuário não encontrado'}), 404
    
    if cliente.senha != data['senha']:
        return jsonify({'erro': 'Senha incorreta'}), 401
    
    return jsonify({'id': cliente.id, 'email': cliente.email, 'nome': cliente.nome})


# 3) Cadastrar endereço (relacionado ao fluxo "Possui Endereço Cadastrado?")
@app.route('/enderecos', methods=['POST'])
def cadastrar_endereco():
    """Cadastrar endereço - parte do fluxo do diagrama
    Campos: cliente_id, rua, numero, bairro, cidade, complemento, tipo_local, cep
    """
    data = request.json
    cliente = Cliente.query.get_or_404(data.get('cliente_id'))
    
    endereco = EnderecoServico(
        cliente_id=cliente.id,
        rua=data.get('rua', ''),
        numero=data.get('numero'),
        bairro=data.get('bairro'),
        cidade=data.get('cidade'),
        complemento=data.get('complemento'),
        tipo_local=data.get('tipo_local'),
        cep=data.get('cep')
    )
    db.session.add(endereco)
    db.session.commit()
    return jsonify({'id': endereco.id}), 201


# 4) Descrever móvel (include de "Solicitar montagem")
@app.route('/moveis', methods=['POST'])
def descrever_movel():
    """Descrever móvel - caso de uso include do diagrama
    Campos: nome, categoria, peso_aproximado, numero_de_volumes
    """
    data = request.json
    movel = Movel(
        nome=data.get('nome', ''),
        categoria=data.get('categoria'),
        peso_aproximado=data.get('peso_aproximado', 0),
        numero_de_volumes=data.get('numero_de_volumes', 1)
    )
    db.session.add(movel)
    db.session.commit()
    return jsonify({'id': movel.id}), 201


# 5) Informar endereço (include de "Solicitar montagem")
@app.route('/enderecos/<int:endereco_id>', methods=['GET'])
def informar_endereco(endereco_id):
    """Informar endereço - caso de uso include do diagrama"""
    endereco = EnderecoServico.query.get_or_404(endereco_id)
    return jsonify({
        'id': endereco.id,
        'rua': endereco.rua,
        'numero': endereco.numero,
        'bairro': endereco.bairro,
        'cidade': endereco.cidade,
        'cep': endereco.cep
    })


# 5.1) Listar endereços do cliente
@app.route('/enderecos', methods=['GET'])
def listar_enderecos():
    """Listar endereços de um cliente - para select de endereços"""
    cliente_id = request.args.get('cliente_id')
    if not cliente_id:
        return jsonify({'erro': 'cliente_id é obrigatório'}), 400
    
    enderecos = EnderecoServico.query.filter_by(cliente_id=int(cliente_id)).all()
    result = []
    for endereco in enderecos:
        result.append({
            'id': endereco.id,
            'rua': endereco.rua,
            'numero': endereco.numero,
            'bairro': endereco.bairro,
            'cidade': endereco.cidade,
            'cep': endereco.cep,
            'endereco_completo': f"{endereco.rua}, {endereco.numero} - {endereco.bairro}, {endereco.cidade}"
        })
    
    return jsonify(result)


# 6) Selecionar data e horário (include de "Solicitar montagem")
# Este é parte do processo de solicitar montagem


# 7) Solicitar montagem (Principal - seguindo diagrama de sequência)
@app.route('/solicitar_montagem', methods=['POST'])
def solicitar_montagem():
    """Solicitar montagem - caso de uso principal
    Segue o diagrama de sequência exatamente:
    1. Cliente solicita montagem (descricaoMovel, endereco, dataHorario)
    2. Sistema verifica disponibilidade (consulta BD)
    3. BD retorna disponibilidade (true/false)
    4. Se disponível: salva agendamento, notifica montador, confirma ao cliente
    5. Se não disponível: informa indisponibilidade
    
    Campos: cliente_id, endereco_id, data_servico, horario_inicio, itens, servicos
    """
    data = request.json
    
    # Validações
    cliente = Cliente.query.get_or_404(data.get('cliente_id'))
    endereco = EnderecoServico.query.get_or_404(data.get('endereco_id'))
    
    try:
        data_servico = datetime.strptime(data.get('data_servico'), '%Y-%m-%d').date()
        horario_inicio = datetime.strptime(data.get('horario_inicio'), '%H:%M').time()
    except Exception:
        return jsonify({'erro': 'Formato de data ou horário inválido'}), 400

    # Verificar disponibilidade (consultarDisponibilidade no diagrama de sequência)
    conflito = Agendamento.query.filter_by(
        data_servico=data_servico,
        horario_inicio=horario_inicio,
        endereco_id=endereco.id
    ).first()
    
    disponibilidade = conflito is None
    
    if not disponibilidade:
        # [não disponível] - informarIndisponibilidade
        return jsonify({
            'disponivel': False,
            'mensagem': 'Horário não disponível'
        }), 409

    # [alt disponível] - salvarAgendamento
    agendamento = Agendamento(
        cliente_id=cliente.id,
        endereco_id=endereco.id,
        data_servico=data_servico,
        horario_inicio=horario_inicio,
        descricao_movel=data.get('descricao_movel', '').strip() or None,
        servicos_adicionais=data.get('servicos_adicionais', '').strip() or None,
        status='Pendente'
    )
    db.session.add(agendamento)
    db.session.commit()

    # Adicionar itens (móveis)
    itens = data.get('itens', [])
    for it in itens:
        movel = Movel.query.get(it['movel_id'])
        if movel:
            item = ItemMontagem(
                agendamento_id=agendamento.id,
                movel_id=movel.id,
                quantidade=it.get('quantidade', 1),
                movel_preco=it.get('movel_preco', 0.0)
            )
            db.session.add(item)
    
    # Adicionar serviços contratados (escolher serviço adicional)
    servicos = data.get('servicos', [])
    for sid in servicos:
        servico = ServicoAdicional.query.get(sid)
        if servico:
            sc = ServicoContratado(
                agendamento_id=agendamento.id,
                servico_id=servico.id,
                valor_cobrado=servico.valor_custo
            )
            db.session.add(sc)
    
    db.session.commit()

    # Calcular valor total
    agendamento.calcularValorTotal()

    # agendamentoCriado (diagrama de sequência retorna com status="Pendente")
    # notificarNovoAgendamento (para montador)
    # confirmarRecebimento (montador)
    # atualizarStatus (confirmado pelo Montador)
    # confirmarAgendamento (retorna para cliente)
    
    return jsonify({
        'agendamentoId': agendamento.id,
        'status': agendamento.status,
        'dataHorario': agendamento.data_servico.isoformat(),
        'disponivel': True,
        'mensagem': 'Agendamento confirmado'
    }), 201


# 8) Visualizar status do agendamento (Cliente)
@app.route('/agendamentos/<int:agendamento_id>/status', methods=['GET'])
def visualizar_status_agendamento(agendamento_id):
    """Visualizar status do agendamento - caso de uso do diagrama"""
    agendamento = Agendamento.query.get_or_404(agendamento_id)
    return jsonify({
        'id': agendamento.id,
        'status': agendamento.status,
        'data_servico': agendamento.data_servico.isoformat(),
        'horario_inicio': agendamento.horario_inicio.strftime('%H:%M'),
        'valor_total': agendamento.valor_total_servico
    })


# 9) Cancelar agendamento (Cliente)
@app.route('/agendamentos/<int:agendamento_id>/cancelar', methods=['POST'])
def cancelar_agendamento(agendamento_id):
    """Cancelar agendamento - caso de uso do diagrama"""
    agendamento = Agendamento.query.get_or_404(agendamento_id)
    agendamento.cancelarAgendamento()
    return jsonify({'id': agendamento.id, 'status': agendamento.status})


# 9.1) Alterar agendamento (Cliente)
@app.route('/agendamentos/<int:agendamento_id>/alterar', methods=['PUT'])
def alterar_agendamento(agendamento_id):
    """Alterar agendamento - permite modificar data, horário e valor"""
    agendamento = Agendamento.query.get_or_404(agendamento_id)
    data = request.json
    
    # Verificar se agendamento pode ser alterado
    if agendamento.status in ['Cancelado', 'Concluído']:
        return jsonify({'erro': f'Não é possível alterar agendamento com status: {agendamento.status}'}), 400
    
    # Validar dados obrigatórios
    if not data:
        return jsonify({'erro': 'Nenhum dado enviado'}), 400
    
    try:
        # Atualizar campos se fornecidos
        if 'data_servico' in data:
            nova_data = datetime.strptime(data['data_servico'], '%Y-%m-%d').date()
            if nova_data <= date.today():
                return jsonify({'erro': 'A data deve ser futura'}), 400
            agendamento.data_servico = nova_data
        
        if 'horario_inicio' in data:
            novo_horario = datetime.strptime(data['horario_inicio'], '%H:%M').time()
            agendamento.horario_inicio = novo_horario
        
        # Atualizar status para "Reagendado" se alterou data/horário
        if 'data_servico' in data or 'horario_inicio' in data:
            agendamento.status = 'Reagendado'
        
        db.session.commit()
        
        return jsonify({
            'id': agendamento.id,
            'status': agendamento.status,
            'data_servico': agendamento.data_servico.strftime('%Y-%m-%d'),
            'horario_inicio': agendamento.horario_inicio.strftime('%H:%M'),
            'valor_total': float(agendamento.valor_total),
            'mensagem': 'Agendamento alterado com sucesso!'
        }), 200
        
    except ValueError as e:
        return jsonify({'erro': f'Dados inválidos: {str(e)}'}), 400
    except Exception as e:
        db.session.rollback()
        return jsonify({'erro': f'Erro ao alterar agendamento: {str(e)}'}), 500


# 10) Registrar montagem concluída (Montador) - extend de "Visualizar agendamentos"
@app.route('/agendamentos/<int:agendamento_id>/registrar_conclusao', methods=['POST'])
def registrar_montagem_concluida(agendamento_id):
    """Registrar montagem concluída - caso de uso do diagrama
    Campos: horario_fim, fotos, observacoes
    """
    agendamento = Agendamento.query.get_or_404(agendamento_id)
    
    # Processar horário de fim
    try:
        if request.form.get('horario_fim'):
            horario_fim = datetime.strptime(request.form.get('horario_fim'), '%H:%M').time()
            agendamento.horario_fim = horario_fim
    except Exception:
        return jsonify({'erro': 'Formato de horário inválido'}), 400
    
    # Processar observações
    if request.form.get('observacoes'):
        agendamento.observacoes_montagem = request.form.get('observacoes')
    
    # Processar fotos
    fotos_urls = []
    if 'fotos' in request.files:
        fotos = request.files.getlist('fotos')
        for foto in fotos:
            if foto and foto.filename != '' and allowed_file(foto.filename):
                # Gerar nome único para o arquivo
                filename = secure_filename(foto.filename)
                timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
                unique_filename = f"{agendamento_id}_{timestamp}_{filename}"
                filepath = os.path.join(app.config['UPLOAD_FOLDER'], unique_filename)
                
                try:
                    foto.save(filepath)
                    foto_url = f"/static/uploads/{unique_filename}"
                    fotos_urls.append(foto_url)
                except Exception as e:
                    return jsonify({'erro': f'Erro ao salvar foto: {str(e)}'}), 500
    
    # Salvar URLs das fotos (separadas por vírgula)
    if fotos_urls:
        agendamento.fotos_conclusao = ','.join(fotos_urls)
    
    agendamento.status = 'Concluído'
    db.session.commit()
    
    return jsonify({
        'id': agendamento.id,
        'status': agendamento.status,
        'horario_fim': agendamento.horario_fim.strftime('%H:%M') if agendamento.horario_fim else None,
        'observacoes': agendamento.observacoes_montagem,
        'fotos': fotos_urls
    })


# 11) Enviar observações/fotos (Montador)
@app.route('/agendamentos/<int:agendamento_id>/observacoes', methods=['POST'])
def enviar_observacoes(agendamento_id):
    """Enviar observações/fotos - caso de uso do diagrama
    Campos: observacoes, fotos (URLs)
    """
    agendamento = Agendamento.query.get_or_404(agendamento_id)
    data = request.json
    
    # Para simplicidade, apenas retornamos confirmação
    # Em um sistema real, armazenaria em tabela separada
    return jsonify({
        'agendamento_id': agendamento.id,
        'observacoes_recebidas': bool(data.get('observacoes')),
        'fotos_recebidas': bool(data.get('fotos'))
    })


# 12) Confirmar disponibilidade (Montador)
@app.route('/montadores/<int:montador_id>/confirmar_disponibilidade', methods=['POST'])
def confirmar_disponibilidade(montador_id):
    """Confirmar disponibilidade - atualizar status de disponibilidade do montador
    Campos: disponivel (boolean)
    """
    montador = Montador.query.get_or_404(montador_id)
    data = request.json
    
    if not data or 'disponivel' not in data:
        return jsonify({'erro': 'Campo disponivel é obrigatório'}), 400
    
    try:
        disponivel = data['disponivel']
        
        # Para simplicidade, vamos adicionar um campo disponivel no banco
        # Por enquanto, simularemos verificando agendamentos ativos
        agendamentos_ativos = Agendamento.query.filter(
            Agendamento.montador_id == montador.id,
            Agendamento.status.in_(['Pendente', 'Confirmado pelo Montador', 'Agendado'])
        ).count()
        
        # Se tem agendamentos ativos, não pode ficar disponível
        if disponivel and agendamentos_ativos > 0:
            return jsonify({
                'erro': f'Você tem {agendamentos_ativos} agendamento(s) ativo(s). Conclua-os primeiro.'
            }), 400
        
        # Simulamos salvando o status (em implementação real, criaria campo na tabela)
        status_atual = 'Disponível' if disponivel else 'Indisponível'
        
        return jsonify({
            'montador_id': montador.id,
            'disponivel': disponivel,
            'status': status_atual,
            'agendamentos_ativos': agendamentos_ativos,
            'mensagem': f'Status atualizado para: {status_atual}'
        }), 200
        
    except Exception as e:
        return jsonify({'erro': f'Erro ao atualizar disponibilidade: {str(e)}'}), 500


# 13) Atribuir montador a agendamento (Administrador)
@app.route('/agendamentos/<int:agendamento_id>/atribuir_montador', methods=['POST'])
def atribuir_montador(agendamento_id):
    """Atribuir montador a agendamento - caso de uso do diagrama
    Campos: montador_id
    """
    agendamento = Agendamento.query.get_or_404(agendamento_id)
    data = request.json
    montador = Montador.query.get_or_404(data.get('montador_id'))
    
    agendamento.atribuirMontador(montador.id)
    agendamento.status = 'Atribuído'
    db.session.commit()
    
    return jsonify({
        'id': agendamento.id,
        'montador_id': agendamento.montador_id,
        'status': agendamento.status
    })


# 14) Visualizar agendamentos (Montador) - extend para "Gerar relatórios"
@app.route('/agendamentos', methods=['GET'])
def visualizar_agendamentos():
    """Visualizar agendamentos - caso de uso do diagrama
    Filtros: montador_id, cliente_id, status
    """
    montador_id = request.args.get('montador_id')
    cliente_id = request.args.get('cliente_id')
    status = request.args.get('status')
    
    q = Agendamento.query
    if montador_id:
        q = q.filter_by(montador_id=int(montador_id))
    if cliente_id:
        q = q.filter_by(cliente_id=int(cliente_id))
    if status:
        q = q.filter_by(status=status)
    
    agendamentos = q.all()
    result = []
    for ag in agendamentos:
        agendamento_data = {
            'id': ag.id,
            'cliente_id': ag.cliente_id,
            'montador_id': ag.montador_id,
            'data_servico': ag.data_servico.isoformat(),
            'horario_inicio': ag.horario_inicio.strftime('%H:%M'),
            'status': ag.status,
            'valor_total': ag.valor_total_servico,
            'descricao_movel': ag.descricao_movel,
            'servicos_adicionais': ag.servicos_adicionais
        }
        
        # Incluir fotos e observações se estiver concluído
        if ag.status == 'Concluído':
            agendamento_data['horario_fim'] = ag.horario_fim.strftime('%H:%M') if ag.horario_fim else None
            agendamento_data['observacoes'] = ag.observacoes_montagem
            agendamento_data['fotos'] = ag.fotos_conclusao.split(',') if ag.fotos_conclusao else []
        
        result.append(agendamento_data)
    
    return jsonify(result)


# 15) Visualizar todos os agendamentos (extend de "Gerar relatórios")
@app.route('/todos_agendamentos', methods=['GET'])
def visualizar_todos_agendamentos():
    """Visualizar todos os agendamentos - extend do caso de uso Gerar relatórios"""
    agendamentos = Agendamento.query.all()
    result = []
    for ag in agendamentos:
        result.append({
            'id': ag.id,
            'cliente_id': ag.cliente_id,
            'montador_id': ag.montador_id,
            'data_servico': ag.data_servico.isoformat(),
            'status': ag.status
        })
    return jsonify(result)


# 16) Gerar relatórios (Administrador)
@app.route('/relatorios', methods=['GET'])
def gerar_relatorios():
    """Gerar relatórios - caso de uso do diagrama
    Retorna resumo de agendamentos por status
    """
    from sqlalchemy import func
    totais = db.session.query(
        Agendamento.status,
        func.count(Agendamento.id)
    ).group_by(Agendamento.status).all()
    
    return jsonify({status: count for status, count in totais})


# 17) Cadastrar tipos de serviço (Administrador)
@app.route('/servicos', methods=['POST'])
def cadastrar_tipos_servico():
    """Cadastrar tipos de serviço - caso de uso do diagrama
    Campos: nome, valor_custo, tempo_adicional
    """
    data = request.json
    servico = ServicoAdicional(
        nome=data.get('nome', ''),
        valor_custo=data.get('valor_custo', 0.0),
        tempo_adicional=data.get('tempo_adicional', 0)
    )
    db.session.add(servico)
    db.session.commit()
    return jsonify({'id': servico.id}), 201


# Listar serviços disponíveis (para o front-end)
@app.route('/servicos', methods=['GET'])
def listar_servicos():
    """Lista todos os serviços adicionais disponíveis"""
    servicos = ServicoAdicional.query.all()
    result = []
    for s in servicos:
        result.append({
            'id': s.id,
            'nome': s.nome,
            'valor_custo': s.valor_custo,
            'tempo_adicional': s.tempo_adicional
        })
    return jsonify(result)


# 18) Gerenciar usuários (Administrador)
@app.route('/clientes', methods=['GET'])
def gerenciar_usuarios():
    """Gerenciar usuários - caso de uso do diagrama
    Lista todos os clientes
    """
    clientes = Cliente.query.all()
    result = []
    for c in clientes:
        result.append({
            'id': c.id,
            'nome': c.nome,
            'email': c.email,
            'telefone': c.telefone
        })
    return jsonify(result)


# -----------------------------
# Rotas auxiliares para cadastro de montadores (necessário para funcionamento)
# -----------------------------
@app.route('/montadores', methods=['POST'])
def cadastrar_montador():
    """Cadastrar montador"""
    data = request.json
    
    # Validar dados obrigatórios
    if not data:
        return jsonify({'erro': 'Nenhum dado enviado'}), 400
    
    if 'email' not in data or not data['email']:
        return jsonify({'erro': 'Email é obrigatório'}), 400
    
    if 'senha' not in data or not data['senha']:
        return jsonify({'erro': 'Senha é obrigatória'}), 400
    
    if len(data['senha']) < 6:
        return jsonify({'erro': 'A senha deve ter no mínimo 6 caracteres'}), 400
    
    # Verificar se email já está cadastrado em Cliente OU Montador
    if Cliente.query.filter_by(email=data['email']).first():
        return jsonify({'erro': 'Este email já está cadastrado como Cliente'}), 400
    
    if Montador.query.filter_by(email=data['email']).first():
        return jsonify({'erro': 'Este email já está cadastrado como Montador'}), 400
    
    try:
        montador = Montador(
            nome=data.get('nome', ''),
            email=data['email'],
            senha=data['senha'],
            regiao=data.get('regiao'),
            especialidade=data.get('especialidade')
        )
        db.session.add(montador)
        db.session.commit()
        return jsonify({'id': montador.id, 'nome': montador.nome}), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({'erro': f'Erro ao cadastrar: {str(e)}'}), 500


@app.route('/montadores/<int:montador_id>', methods=['GET'])
def obter_montador(montador_id):
    """Obter dados do montador incluindo status de disponibilidade"""
    montador = Montador.query.get_or_404(montador_id)
    
    # Verificar agendamentos ativos
    agendamentos_ativos = Agendamento.query.filter(
        Agendamento.montador_id == montador.id,
        Agendamento.status.in_(['Pendente', 'Confirmado pelo Montador', 'Agendado'])
    ).count()
    
    # Determinar disponibilidade baseado nos agendamentos
    disponivel = montador.estaDisponivel()
    
    return jsonify({
        'id': montador.id,
        'nome': montador.nome,
        'regiao': montador.regiao,
        'especialidade': montador.especialidade,
        'disponivel': disponivel,
        'agendamentos_ativos': agendamentos_ativos,
        'ultima_atualizacao': datetime.now().strftime('%d/%m/%Y %H:%M:%S')
    })


@app.route('/montadores/login', methods=['POST'])
def login_montador():
    """Login de montador por email e senha"""
    data = request.json
    
    if not data or 'email' not in data or 'senha' not in data:
        return jsonify({'erro': 'Email e senha são obrigatórios'}), 400
    
    montador = Montador.query.filter_by(email=data['email']).first()
    
    if not montador:
        return jsonify({'erro': 'Usuário não encontrado'}), 404
    
    if montador.senha != data['senha']:
        return jsonify({'erro': 'Senha incorreta'}), 401
    
    return jsonify({
        'id': montador.id,
        'nome': montador.nome
    })


# -----------------------------
# Endpoint temporário para limpar banco de dados
# -----------------------------
@app.route('/reset-database', methods=['POST'])
def reset_database():
    """CUIDADO: Deleta TODOS os dados do banco!"""
    try:
        # Deletar todas as tabelas na ordem correta (respeitando foreign keys)
        db.session.query(ServicoContratado).delete()
        db.session.query(ItemMontagem).delete()
        db.session.query(Agendamento).delete()
        db.session.query(EnderecoServico).delete()
        db.session.query(ServicoAdicional).delete()
        db.session.query(Movel).delete()
        db.session.query(Montador).delete()
        db.session.query(Cliente).delete()
        db.session.commit()
        
        return jsonify({
            'mensagem': 'Banco de dados limpo com sucesso! Todos os clientes e montadores foram removidos.',
            'status': 'success'
        }), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({
            'erro': f'Erro ao limpar banco: {str(e)}',
            'status': 'error'
        }), 500


# -----------------------------
# Execução
# -----------------------------

if __name__ == '__main__':
    import os
    port = int(os.environ.get('PORT', 5000))
    debug = os.environ.get('FLASK_ENV') != 'production'
    app.run(host='0.0.0.0', port=port, debug=debug)
