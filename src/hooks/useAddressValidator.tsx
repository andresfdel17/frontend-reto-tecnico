import { useState, useCallback } from 'react';
import type { IAddressValidationResult, IAddressValidationRequest } from '@types';

export function useAddressValidator(apiKey?: string) {
    const [isValidating, setIsValidating] = useState(false);
    const [lastResult, setLastResult] = useState<IAddressValidationResult | null>(null);

    const validateAddress = useCallback(async (
        request: IAddressValidationRequest
    ): Promise<IAddressValidationResult> => {
        if (!apiKey) {
            const error = 'Google API key is required for address validation';
            console.error(error);
            return {
                isValid: false,
                errors: [error]
            };
        }

        setIsValidating(true);
        
        try {
            const requestBody = {
                address: {
                    addressLines: [request.address],
                    regionCode: request.regionCode || 'CO', // Colombia por defecto
                    locality: request.locality,
                },
                enableUspsCass: request.enableUspsCass || false,
            };

            const response = await fetch(
                `https://addressvalidation.googleapis.com/v1:validateAddress?key=${apiKey}`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(requestBody),
                }
            );

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            
            // Procesar la respuesta de Google
            const result = processGoogleResponse(data);
            setLastResult(result);
            
            return result;

        } catch (error) {
            console.error('Address validation error:', error);
            const errorResult: IAddressValidationResult = {
                isValid: false,
                errors: [error instanceof Error ? error.message : 'Unknown error occurred']
            };
            setLastResult(errorResult);
            return errorResult;
        } finally {
            setIsValidating(false);
        }
    }, [apiKey]);

    // Función para validar solo si la dirección es válida (sin detalles)
    const isAddressValid = useCallback(async (
        address: string,
        regionCode?: string
    ): Promise<boolean> => {
        const result = await validateAddress({ address, regionCode });
        return result.isValid;
    }, [validateAddress]);

    return {
        validateAddress,
        isAddressValid,
        isValidating,
        lastResult,
    };
}

function processGoogleResponse(data: any): IAddressValidationResult {
    try {
        const result = data.result;
        
        if (!result) {
            return {
                isValid: false,
                errors: ['No result returned from Google API']
            };
        }

        // Verificar si la dirección fue validada
        const verdict = result.verdict;
        const isValid = verdict?.addressComplete && verdict?.hasUnconfirmedComponents !== true;

        // Extraer la dirección formateada
        const formattedAddress = result.address?.formattedAddress;

        // Extraer componentes de la dirección
        const addressComponents = result.address?.addressComponents || [];
        const components: IAddressValidationResult['components'] = {};

        addressComponents.forEach((component: any) => {
            const types = component.componentType;
            const value = component.componentName?.text;

            if (types?.includes('street_number')) {
                components.streetNumber = value;
            } else if (types?.includes('route')) {
                components.route = value;
            } else if (types?.includes('locality')) {
                components.locality = value;
            } else if (types?.includes('administrative_area_level_1')) {
                components.administrativeArea = value;
            } else if (types?.includes('country')) {
                components.country = value;
            } else if (types?.includes('postal_code')) {
                components.postalCode = value;
            }
        });

        // Determinar nivel de confianza
        let confidence: IAddressValidationResult['confidence'] = 'LOW';
        if (verdict?.addressComplete && verdict?.hasUnconfirmedComponents !== true) {
            confidence = 'HIGH';
        } else if (verdict?.addressComplete) {
            confidence = 'MEDIUM';
        }

        return {
            isValid,
            formattedAddress,
            components,
            confidence,
            errors: isValid ? undefined : ['Address could not be fully validated']
        };

    } catch (error) {
        return {
            isValid: false,
            errors: ['Error processing Google API response']
        };
    }
}
