import React from 'react';
import { Link } from 'react-router-dom';

export const Footer = () => {
  return (
    <footer className="bg-muted mt-auto">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
                <span className="text-primary-foreground font-bold">SC</span>
              </div>
              <span className="font-bold text-xl text-primary">SportsCourt</span>
            </div>
            <p className="text-muted-foreground max-w-md">
              La plataforma líder para reservar espacios deportivos. 
              Conectamos deportistas con las mejores canchas de la ciudad.
            </p>
          </div>
          
          <div>
            <h3 className="font-semibold text-foreground mb-4">Deportes</h3>
            <ul className="space-y-2">
              <li><Link to="/venues?sport=soccer" className="text-muted-foreground hover:text-primary">Fútbol</Link></li>
              <li><Link to="/venues?sport=basketball" className="text-muted-foreground hover:text-primary">Básquetbol</Link></li>
              <li><Link to="/venues?sport=tennis" className="text-muted-foreground hover:text-primary">Tenis</Link></li>
              <li><Link to="/venues?sport=volleyball" className="text-muted-foreground hover:text-primary">Voleibol</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold text-foreground mb-4">Empresa</h3>
            <ul className="space-y-2">
              <li><Link to="/about" className="text-muted-foreground hover:text-primary">Quiénes Somos</Link></li>
              <li><Link to="/contact" className="text-muted-foreground hover:text-primary">Contacto</Link></li>
              <li><Link to="/terms" className="text-muted-foreground hover:text-primary">Términos</Link></li>
              <li><Link to="/privacy" className="text-muted-foreground hover:text-primary">Privacidad</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-border mt-8 pt-8 text-center">
          <p className="text-muted-foreground">
            © 2024 SportsCourt. Todos los derechos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
};