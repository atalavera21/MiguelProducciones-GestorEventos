import { type Contrato, type CrearContratoDto, type ActualizarContratoDto, MetodoPago } from '../../domain/entities/Contrato';
import { type IContratoRepository } from '../../domain/repositories/IContratoRepository';
import prisma from '../database/prismaClient';

export class PrismaContratoRepository implements IContratoRepository {

  async findAll(): Promise<Contrato[]> {
    const contratos = await prisma.contrato.findMany({
      orderBy: { fechaContrato: 'desc' },
    });
    return contratos.map(this.toDomain);
  }

  async findById(id: number): Promise<Contrato | null> {
    const contrato = await prisma.contrato.findUnique({ where: { id } });
    if (!contrato) return null;
    return this.toDomain(contrato);
  }

  async findByEventoId(idEvento: number): Promise<Contrato | null> {
    const contrato = await prisma.contrato.findUnique({ where: { idEvento } });
    if (!contrato) return null;
    return this.toDomain(contrato);
  }

  async create(dto: CrearContratoDto): Promise<Contrato> {
    // El use case GenerarContrato es responsable de consultar el evento
    // y el cliente para obtener los datos desnormalizados antes de llamar aquí.
    // Este repositorio solo persiste — no tiene lógica de negocio.
    const contrato = await prisma.contrato.create({
      data: dto as any,
    });
    return this.toDomain(contrato);
  }

  async update(id: number, dto: ActualizarContratoDto): Promise<Contrato | null> {
    try {
      const contrato = await prisma.contrato.update({
        where: { id },
        data: dto as any,
      });
      return this.toDomain(contrato);
    } catch {
      return null;
    }
  }

  async delete(id: number): Promise<boolean> {
    try {
      await prisma.contrato.delete({ where: { id } });
      return true;
    } catch {
      return false;
    }
  }

  private toDomain(p: {
    id: number;
    idEvento: number;
    idEstado: number;
    nombreCliente: string;
    dniCliente: string;
    telefonoCliente: string;
    tipoEvento: string;
    direccionEvento: string;
    fechaHoraEvento: Date;
    montoTotal: any;
    montoAdelanto: any;
    saldo: any;
    metodoPago: string;
    cuentaPago: string;
    dniFotografo: string;
    fechaContrato: Date;
    pdfUrl: string | null;
  }): Contrato {
    return {
      id:              p.id,
      idEvento:        p.idEvento,
      idEstado:        p.idEstado,
      nombreCliente:   p.nombreCliente,
      dniCliente:      p.dniCliente,
      telefonoCliente: p.telefonoCliente,
      tipoEvento:      p.tipoEvento,
      direccionEvento: p.direccionEvento,
      fechaHoraEvento: p.fechaHoraEvento,
      // Prisma devuelve Decimal para campos @db.Decimal — convertimos a number
      montoTotal:      p.montoTotal.toNumber(),
      montoAdelanto:   p.montoAdelanto.toNumber(),
      saldo:           p.saldo.toNumber(),
      metodoPago:      p.metodoPago as MetodoPago,
      cuentaPago:      p.cuentaPago,
      dniFotografo:    p.dniFotografo,
      fechaContrato:   p.fechaContrato,
      pdfUrl:          p.pdfUrl ?? undefined,
    };
  }
}
