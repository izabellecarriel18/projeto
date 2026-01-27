import { User, Mail, Shield } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

export default function ProfilePage() {
  const { user, profile } = useAuth();

  if (!user) {
    return (
      <div className="min-h-screen pt-10 sm:pt-12 pb-12 sm:pb-20">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="text-center py-12 sm:py-20">
            <User className="w-12 h-12 sm:w-16 sm:h-16 text-white mx-auto mb-4" />
            <p className="text-white text-lg sm:text-xl">Faça login para ver seu perfil</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-10 sm:pt-12 pb-12 sm:pb-20">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="mb-8 sm:mb-12">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-3 sm:mb-4">
            Minhas Credenciais
          </h1>
        </div>

        <div className="max-w-2xl mx-auto">
          <div className="backdrop-blur border border-gray-800 rounded-lg p-6 sm:p-8">
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="bg-red-600/10 p-3 rounded-lg">
                  <User className="w-6 h-6 text-red-600" />
                </div>
                <div className="flex-1">
                  <p className="text-gray-400 text-sm mb-1">Nome</p>
                  <p className="text-white text-lg font-medium">{profile?.name}</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="bg-red-600/10 p-3 rounded-lg">
                  <Mail className="w-6 h-6 text-red-600" />
                </div>
                <div className="flex-1">
                  <p className="text-gray-400 text-sm mb-1">Email</p>
                  <p className="text-white text-lg font-medium break-all">{user.email}</p>
                </div>
              </div>

              {profile?.is_admin && (
                <div className="flex items-start gap-4">
                  <div className="bg-red-600/10 p-3 rounded-lg">
                    <Shield className="w-6 h-6 text-red-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-gray-400 text-sm mb-1">Permissão</p>
                    <p className="text-white text-lg font-medium">Administrador</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
