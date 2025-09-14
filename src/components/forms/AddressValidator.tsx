import React, { useState } from 'react';
import { Form, Button, Alert, Spinner, Badge } from 'react-bootstrap';
import { useAddressValidator } from '@hooks';
import type { IAddressValidationResult } from '@types';

interface AddressValidatorProps {
    apiKey: string;
    onValidAddress?: (result: IAddressValidationResult) => void;
    onInvalidAddress?: (result: IAddressValidationResult) => void;
    defaultRegionCode?: string;
}

export const AddressValidator: React.FC<AddressValidatorProps> = ({
    apiKey,
    onValidAddress,
    onInvalidAddress,
    defaultRegionCode = 'CO'
}) => {
    const [address, setAddress] = useState('');
    const [regionCode, setRegionCode] = useState(defaultRegionCode);
    const { validateAddress, isValidating, lastResult } = useAddressValidator(apiKey);

    const handleValidate = async () => {
        if (!address.trim()) return;

        const result = await validateAddress({
            address: address.trim(),
            regionCode,
        });

        if (result.isValid && onValidAddress) {
            onValidAddress(result);
        } else if (!result.isValid && onInvalidAddress) {
            onInvalidAddress(result);
        }
    };

    const getConfidenceBadge = (confidence?: string) => {
        switch (confidence) {
            case 'HIGH':
                return <Badge bg="success">Alta Confianza</Badge>;
            case 'MEDIUM':
                return <Badge bg="warning">Confianza Media</Badge>;
            case 'LOW':
                return <Badge bg="danger">Baja Confianza</Badge>;
            default:
                return null;
        }
    };

    return (
        <div className="address-validator">
            <Form>
                <Form.Group className="mb-3">
                    <Form.Label>Dirección</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="Ingresa la dirección completa"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        disabled={isValidating}
                    />
                </Form.Group>

                <Form.Group className="mb-3">
                    <Form.Label>País</Form.Label>
                    <Form.Select
                        value={regionCode}
                        onChange={(e) => setRegionCode(e.target.value)}
                        disabled={isValidating}
                    >
                        <option value="CO">Colombia</option>
                        <option value="US">Estados Unidos</option>
                        <option value="MX">México</option>
                        <option value="AR">Argentina</option>
                        <option value="BR">Brasil</option>
                        <option value="ES">España</option>
                    </Form.Select>
                </Form.Group>

                <Button
                    variant="primary"
                    onClick={handleValidate}
                    disabled={isValidating || !address.trim()}
                    className="mb-3"
                >
                    {isValidating ? (
                        <>
                            <Spinner size="sm" className="me-2" />
                            Validando...
                        </>
                    ) : (
                        'Validar Dirección'
                    )}
                </Button>
            </Form>

            {lastResult && (
                <div className="validation-result">
                    <Alert variant={lastResult.isValid ? 'success' : 'danger'}>
                        <div className="d-flex justify-content-between align-items-start">
                            <div>
                                <strong>
                                    {lastResult.isValid ? '✅ Dirección Válida' : '❌ Dirección Inválida'}
                                </strong>
                                {lastResult.confidence && (
                                    <div className="mt-1">
                                        {getConfidenceBadge(lastResult.confidence)}
                                    </div>
                                )}
                            </div>
                        </div>

                        {lastResult.formattedAddress && (
                            <div className="mt-2">
                                <strong>Dirección Formateada:</strong>
                                <div className="text-muted">{lastResult.formattedAddress}</div>
                            </div>
                        )}

                        {lastResult.components && (
                            <div className="mt-2">
                                <strong>Componentes:</strong>
                                <ul className="mb-0 mt-1">
                                    {lastResult.components.streetNumber && (
                                        <li><small>Número: {lastResult.components.streetNumber}</small></li>
                                    )}
                                    {lastResult.components.route && (
                                        <li><small>Calle: {lastResult.components.route}</small></li>
                                    )}
                                    {lastResult.components.locality && (
                                        <li><small>Ciudad: {lastResult.components.locality}</small></li>
                                    )}
                                    {lastResult.components.administrativeArea && (
                                        <li><small>Estado/Provincia: {lastResult.components.administrativeArea}</small></li>
                                    )}
                                    {lastResult.components.country && (
                                        <li><small>País: {lastResult.components.country}</small></li>
                                    )}
                                    {lastResult.components.postalCode && (
                                        <li><small>Código Postal: {lastResult.components.postalCode}</small></li>
                                    )}
                                </ul>
                            </div>
                        )}

                        {lastResult.errors && lastResult.errors.length > 0 && (
                            <div className="mt-2">
                                <strong>Errores:</strong>
                                <ul className="mb-0 mt-1">
                                    {lastResult.errors.map((error, index) => (
                                        <li key={index}><small className="text-danger">{error}</small></li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </Alert>
                </div>
            )}
        </div>
    );
};
