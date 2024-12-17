// backend/src/controllers/editRequestController.ts
import { Request, Response } from 'express';
import EditRequest from '../models/EditRequest';
import User from '../models/User';
import Phrase from '../models/Phrase';

export const requestEditPermission = async (req: Request, res: Response) => {
  try {
    const { phraseId } = req.body;
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ message: 'No autorizado' });
    }

    const existingRequest = await EditRequest.findOne({ where: { userId, phraseId } });
    if (existingRequest) {
      return res.status(400).json({ message: 'Ya existe una solicitud para esta frase' });
    }

    const request = await EditRequest.create({ userId, phraseId, status: 'pending' });
    res.status(201).json(request);
  } catch (error) {
    res.status(500).json({ message: 'Error al crear la solicitud', error });
  }
};

export const getEditRequests = async (req: Request, res: Response) => {
  try {
    const requests = await EditRequest.findAll({
      where: { status: 'pending' },
      include: [User, Phrase],
    });
    res.status(200).json(requests);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener solicitudes', error });
  }
};

export const updateRequestStatus = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status } = req.body; // "approved" | "rejected"

    const request = await EditRequest.findByPk(id);
    if (!request) return res.status(404).json({ message: 'Solicitud no encontrada' });

    request.status = status;
    await request.save();

    res.status(200).json({ message: 'Solicitud actualizada', request });
  } catch (error) {
    res.status(500).json({ message: 'Error al actualizar solicitud', error });
  }
};